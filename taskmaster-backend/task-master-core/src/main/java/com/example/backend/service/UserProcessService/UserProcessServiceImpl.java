package com.example.backend.service.UserProcessService;

import com.example.backend.config.AuthenticatedUser;
import com.example.backend.config.JwtUtil;
import com.example.backend.constants.StringCodes;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Branch;
import com.example.backend.model.Task;
import com.example.backend.repository.BranchRepository;
import com.example.backend.service.EmailService.EmailService;
import com.example.backend.service.TaskService.TaskCacheService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import com.example.backend.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.UserRequest;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProcessServiceImpl implements UserProcessService{

    @Autowired
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final BranchRepository branchRepository;
    private final AuthenticatedUser authenticatedUser;
    private final UserCacheService userCacheService;
    private final EmailService emailService;
    private final TaskCacheService taskCacheService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<User>> addUser(UserRequest userRequest) {

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseModel.error("Email already in use", StringCodes.ERROR.getPath()));
        }

        if (userRepository.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseModel.error("Username already in use", StringCodes.ERROR.getPath()));
        }

        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());

        String hashedPassword = passwordEncoder.encode(userRequest.getPassword());
        user.setPassword(hashedPassword);

        if (userRequest.getBranchId() != null) {
            Branch branch = new Branch();
            branch.setId(userRequest.getBranchId());
            user.setBranchLocation(branch);
        }
        User savedUser = userRepository.save(user);
        try {
            emailService.sendTemplatedEmail(
                    savedUser.getEmail(),
                    "NEW_USER_ASSIGNMENT",
                    Map.of(
                            "username", savedUser.getUsername() != null ? savedUser.getUsername() : "USERNAME",
                            "loginUrl", "https://taskmasteropnexus.xyz/"
                    )
            );
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponseModel.error("FAILED TO SEND EMAIL", "ERROR"));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseModel.success("User created successfully", StringCodes.SUCCESS.getPath(), savedUser));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<User>>> getUsers() {
        try {
            //List<User> users = userRepository.findAll();
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT * FROM users WHERE del = 0");
            Query query = entityManager.createNativeQuery(sql.toString(), User.class);

            List<User> users = query.getResultList();

            return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponseModel.success("Users found", StringCodes.SUCCESS.getPath(), users));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<User>>> findUser(UserRequest userRequest) {
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT * FROM users WHERE 1=1 ");
            if (userRequest.getId() != null) {
                sql.append("AND id = :id ");
            }

            if (userRequest.getUsername() != null && !userRequest.getUsername().trim().isEmpty()) {
                sql.append("AND username LIKE :username ");
            }

            if (userRequest.getEmail() != null && !userRequest.getEmail().trim().isEmpty()) {
                sql.append("AND email LIKE :email ");
            }

            Query query = entityManager.createNativeQuery(sql.toString(), User.class);

            if (userRequest.getId() != null) {
                query.setParameter("id", userRequest.getId());
            }

            if (userRequest.getUsername() != null && !userRequest.getUsername().trim().isEmpty()) {
                query.setParameter("username", userRequest.getUsername());
            }

            if (userRequest.getEmail() != null && !userRequest.getEmail().trim().isEmpty()) {
                query.setParameter("email", userRequest.getEmail());
            }

            List<User> users = query.getResultList();

            return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponseModel.success("Users found", StringCodes.SUCCESS.getPath(), users));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<User>> loginUser(UserRequest userRequest) {
        try {

            User user = userRepository.findByEmail(userRequest.getEmail())
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseModel.error("Login failed.", StringCodes.ERROR.getPath()));
            }

            if (!passwordEncoder.matches(userRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseModel.error("LOGIN FAIL", StringCodes.ERROR.getPath()));
            }

            StringBuilder sql = new StringBuilder();

            sql.append("SELECT * FROM users WHERE id = :id");

            Query query = entityManager.createNativeQuery(sql.toString(), User.class);
            query.setParameter("id", user.getId());

            User queryResult = (User) query.getSingleResult();

            emailService.sendTemplatedEmail(
                    user.getEmail(),
                    "LOG_IN_CONFIRMATION",
                    Map.of(
                            "username", user.getUsername(),
                            "tasksUrl", "https://taskmasteropnexus.xyz/tasks/my-tasks"
                    )
            );

            userCacheService.evictResetCode(queryResult.getEmail());

            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponseModel.success(StringCodes.USER_LOG_IN.getPath(), StringCodes.SUCCESS.getPath(), queryResult));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error(e.getMessage(), StringCodes.ERROR.getPath()));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<User>> logoutUser () {
        ResponseCookie cookie = jwtUtil.deleteCookie();
        userCacheService.evictUserCache();
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponseModel.success("SUCCESSFUL LOG OUT", StringCodes.SUCCESS.getPath(),null));
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Object>> updateUser(String id, UserRequest userRequest) {
        try {
            User oldUserSnapshot;
            User user = userRepository.findById(id)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseModel.error("User not found", StringCodes.ERROR.getPath()));
            }

            oldUserSnapshot = new User();
            oldUserSnapshot.setId(user.getId());
            oldUserSnapshot.setUsername(user.getUsername());
            oldUserSnapshot.setEmail(user.getEmail());
            oldUserSnapshot.setRole(user.getRole());
            oldUserSnapshot.setBranchLocation(user.getBranchLocation());

            boolean changed = false;

            if (userRequest.getEmail() != null && !userRequest.getEmail().trim().isEmpty()) {
                if (!userRequest.getEmail().equals(user.getEmail())
                        && userRepository.existsByEmail(userRequest.getEmail())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(ApiResponseModel.error("EMAIL ALREADY IN USE", StringCodes.ERROR.getPath()));
                }
                user.setEmail(userRequest.getEmail());
                changed = true;
            }

            if (userRequest.getBranchId() != null) {
                Branch branch = branchRepository.findById(userRequest.getBranchId())
                        .orElse(null);
                if (branch == null) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponseModel.error("Branch not found", StringCodes.ERROR.getPath()));
                }
                user.setBranchLocation(branch);
                changed = true;
            }

            if (userRequest.getUsername() != null && !userRequest.getUsername().trim().isEmpty()) {
                if (userRequest.getUsername().equals(user.getUsername())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(ApiResponseModel.error("USERNAME ALREADY IN USE", StringCodes.ERROR.getPath()));
                }
                user.setUsername(userRequest.getUsername());
                changed = true;
            }

            if (!changed) {
                return ResponseEntity.ok(
                        ApiResponseModel.update("No changes detected", StringCodes.SUCCESS.getPath(), oldUserSnapshot, oldUserSnapshot));
            }

            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(
                    ApiResponseModel.update("USER UPDATED", StringCodes.SUCCESS.getPath(), updatedUser, oldUserSnapshot));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseModel.error("Failed to update user: " + e.getMessage(), StringCodes.ERROR.getPath()));
        }
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<User>> deleteUser(String id) {

        if (id == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseModel.error("NO ID PROVIDED", StringCodes.ERROR.getPath()));
        }

//        User user = userRepository.findById(id).orElse(null);
//
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
//        }
//
//        user.setDel(1);
//
//        User deletedUser = userRepository.save(user);
        StringBuilder sql = new StringBuilder();

        sql.append("DELETE FROM users WHERE id = :id");

        Query query = entityManager.createNativeQuery(sql.toString(), User.class);

        query.setParameter("id", id);

        query.executeUpdate();

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("USER DELETED", StringCodes.SUCCESS.getPath(), null));
    }

    @Override
    public ResponseEntity<ApiResponseModel<User>> getUserById(String id) {
        User user = userCacheService.getUserInCache(id);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("USER NOT FOUND", StringCodes.ERROR.getPath()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("USER FOUND", StringCodes.SUCCESS.getPath(), user));
    }


    @Override
    public ResponseEntity<ApiResponseModel<User>> getAuthUser() {
        User user = authenticatedUser.getAuthenticatedUser();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("USER FOUND", StringCodes.SUCCESS.getPath(), user));
    }

    @Override
    public ResponseEntity<ApiResponseModel<User>> resetPassword(UserRequest userRequest, String code) {

        String randomCode = this.generateCode(4);

        User user = userCacheService.getUserInCacheByEmail(userRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseModel.error("USER NOT FOUND", StringCodes.ERROR.getPath()));
        }
        if (userRequest.isReset.equals(StringCodes.FALSE.getFlag())) {
            userCacheService.saveCode(user.getEmail(), randomCode);
        }

        if (userRequest.isReset.equals(StringCodes.FALSE.getFlag())) {
            emailService.sendTemplatedEmail(
                    user.getEmail(),
                    "RESET_PASSWORD_EMAIL",
                    Map.of(
                            "passwordCode", randomCode,
                            "memberName", user.getUsername()
                    )
            );
            return ResponseEntity.status(HttpStatus.OK).body(
                    ApiResponseModel.success("Reset password code has been sent to " + user.getEmail(), StringCodes.SUCCESS.getPath(), user)
            );
        }

        String codeRequest = userCacheService.getCode(userRequest.getEmail());
        System.out.println(codeRequest);
        if (!Objects.equals(code, codeRequest)) {
            userCacheService.evictResetCode(user.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseModel.error("CODE IS NOT VALID", StringCodes.ERROR.getPath()));
        }

        String password = passwordEncoder.encode(userRequest.getPassword());
        user.setPassword(password);

        userRepository.save(user);

        emailService.sendTemplatedEmail(
            user.getEmail(),
            "RESET_PASSWORD_EMAIL_SUCCESS",
                Map.of(
                        "memberName", user.getUsername()
                )
        );
        userCacheService.evictResetCode(user.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponseModel.success("RESET PASSWORD SUCCESS", StringCodes.SUCCESS.getPath(), user)
        );
    }

    @Override
    public ResponseEntity<ApiResponseModel<String>> confirmResetPasswordCode(UserRequest userRequest, String code) {
        User user = userCacheService.getUserInCacheByEmail(userRequest.getEmail());
        String codeRequest = userCacheService.getCode(user.getEmail());

        if (!Objects.equals(code, codeRequest)) {
            userCacheService.evictResetCode(user.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseModel.error("CODE IS NOT VALID", StringCodes.ERROR.getPath()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponseModel.success("CODE IS VALID", StringCodes.SUCCESS.getPath(), codeRequest)
        );
    }

    public String generateCode (Integer length) {
        Random random = new Random();
        String characters = StringCodes.RANDOM_STRING.getPath();
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            sb.append(characters.charAt(index));
        }
        return sb.toString();
    }

    public ResponseEntity<ApiResponseModel<String>> emailUsers () {
        List<User> users = userRepository.findRandomUsers();

        for (User user : users) {
            List<Task> userTasks = taskCacheService.getAllOpenTaskCache(user.getId());
            Integer userTaskCount = userTasks.size();
            log.info("SENDING EMAIL TO: {}", user.getEmail());
            emailService.sendTemplatedEmail(
                    user.getEmail(),
                    "PENDING_TASKS_EMAIL",
                    Map.of(
                            "memberName", user.getUsername(),
                            "taskCount", userTaskCount.toString()
                    )
            );

        }

        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponseModel.success("EMAIL SENT TO USERS", "SUCCESS", null)
        );
    }
}
