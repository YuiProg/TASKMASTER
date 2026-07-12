package com.example.backend.service.BranchService;

import com.example.backend.config.JwtUtil;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Branch;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.BranchRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.BranchRequest;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class BranchService implements BranchServiceInterface{

    private final EntityManager entityManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Branch>> addBranch(BranchRequest branchRequest, HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromCookie(request);
        String tokenPayload = jwtUtil.extractSubject(token);

        User user = (User) userRepository.findById(tokenPayload).orElse(null);

        Branch branch = new Branch();

        branch.setBranchLocation(branchRequest.getBranchLocation());
        branch.setCreatedAt(String.valueOf(new Date()));
        branch.setCreatedBy(user);

        Branch newBranch = branchRepository.save(branch);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseModel.success("NEW BRANCH CREATED", "SUCCESS", newBranch));
    }

    @Override
    @GetMapping("/api/v1/getBranches")
    public ResponseEntity<ApiResponseModel<List<Branch>>> getBranches() {
        try {
            List<Branch> branches = branchRepository.findAll();
            return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponseModel.success("BRANCHES FOUND", "SUCCESS", branches));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseModel.error(e.getMessage(), "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Branch>>> getBranchesByName(String branchLocation) {
        List<Branch> branches = branchRepository.findByBranchLocation(branchLocation);
        return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponseModel.success("BRANCHES FOUND", "SUCCESS", branches));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<User>>> getUsersOnBranch(String id) {
        List<User> users = branchRepository.getUsersBranch(id);
        System.out.println(id);
        if (users == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseModel.error("SERVER ERROR", "ERROR"));
        }

        return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponseModel.success("USERS FOUND", "SUCCESS", users));
    }
}
