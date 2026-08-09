package com.example.backend.service.ProjectService;

import com.example.backend.config.AuthenticatedUser;
import com.example.backend.config.JwtUtil;
import com.example.backend.constants.StringCodes;
import com.example.backend.dto.AddProjectMembersDTO;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Project;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.ProjectRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectServiceInterface{

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final AuthenticatedUser authenticatedUser;
    private final ProjectRepository projectRepository;
    private final ProjectCacheService projectCacheService;

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Project>> createProject(ProjectRequest projectRequest) {
        User user = userRepository.findById(projectRequest.getCreatedBy()).orElse(null);
        User authUser = authenticatedUser.getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseModel.error("NOT LOGGED IN", "ERROR"));
        }

        Project project;

        project = new Project();
        project.setProjectName(projectRequest.getProjectName());
        project.setCreatedBy(user);
        project.setProjectName(projectRequest.getProjectName());
        project.setCreatedAt(new Date().getTime());
        project.setUpdatedBy(user.getUsername());
        project.setDescription(projectRequest.getDescription());

        if (projectRequest.getStatus() != null && !projectRequest.getStatus().trim().isEmpty()) {
            project.setStatus(projectRequest.getStatus());
        }

        if (projectRequest.getPriorities() != null) {
            List<String> priorities = new ArrayList<>(projectRequest.getPriorities());

            if (!priorities.contains("CLOSED")) {
                priorities.add("CLOSED");
            }
            project.setPriorities(priorities);
        }

        List<User> members = new ArrayList<>();
        project.setMembers(members);
        if (!projectRequest.getEmails().isEmpty()) {
            for (String email : projectRequest.getEmails()) {
                User userData = userRepository.findByEmail(email).orElse(null);
                if (userData != null) {
                    members.add(userData);
                } else {
                    log.info("USER: {} IS NOT FOUND PROCEEDING", email);
                }
            }
            project.setMembers(members);
        }
        projectCacheService.evictUserCreatedProjects(authUser.getId());
        projectCacheService.evictUserProjectsCache();
        Project newProject = projectRepository.save(project);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseModel.success("PROJECT CREATED", "SUCCESS", newProject));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Project>>> getProjects() {
        User user = authenticatedUser.getAuthenticatedUser();
        log.info("userId: {}", user.getId());
//        List<Project> checkIfUserBelongsInAProject = projectRepository.checkIfUserIsInAProject(user.getId());
//
//        if (checkIfUserBelongsInAProject.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECTS FOUND", "SUCCESS", null));
//        }

        List<Project> projects = projectCacheService.getProjectsCache(user.getId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECTS FOUND", "SUCCESS", projects));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Project>> getProjectById(String id) {
        Project project = projectCacheService.getProjectInCacheById(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECTS FOUND", "SUCCESS", project));
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Project>> addMemberToProject(String projectId, AddProjectMembersDTO addProjectMembersDTO) {
        try {
            Project project = projectRepository.findById(projectId).orElse(null);
            if (project == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseModel.error("Project not found", "ERROR"));
            }

            List<User> members = project.getMembers();
            if (members == null) {
                members = new ArrayList<>();
            }

            List<String> notFound = new ArrayList<>();

            for (String email : addProjectMembersDTO.getEmails()) {
                User user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {
                    notFound.add(email);
                    continue;
                }

                boolean alreadyMember = members.stream()
                        .anyMatch(m -> m.getId().equals(user.getId()));

                if (!alreadyMember) {
                    members.add(user);
                }
            }
            project.setMembers(members);
            Project updatedProject = projectRepository.save(project);
            projectCacheService.evictUserViewProjectCache(project.getProjectName());
            projectCacheService.evictUserProjectsCache();
            return ResponseEntity.ok(
                    ApiResponseModel.success("MEMBER/s ADDED TO PROJECT", "SUCCESS", updatedProject));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseModel.error("Failed to add member: " + e.getMessage(), "ERROR"));
        }
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Project>> removeMemberToProject(String projectId, String userId) {
        try {
            Project project = projectRepository.findById(projectId).orElse(null);
            if (project == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseModel.error("Project not found", "ERROR"));
            }

            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseModel.error("User not found", "ERROR"));
            }

            boolean removed = project.getMembers().remove(user);
            if (!removed) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponseModel.error("User is not a member of this project", "ERROR"));
            }

            Project updatedProject = projectRepository.save(project);

            return ResponseEntity.ok(
                    ApiResponseModel.success("MEMBER REMOVED TO PROJECT", "SUCCESS", updatedProject));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseModel.error("Failed to add member: " + e.getMessage(), "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Project>>> getAuthUserProjects() {
        User user = authenticatedUser.getAuthenticatedUser();

        List<Project> projects = user.getProjects();

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECTS FOUND", "SUCCESS", projects));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Project>> getProjectByName(String name) {
        Project project = projectCacheService.getProjectInCache(name);

        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("PROJECT NOT FOUND", "ERROR"));
        }
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECT FOUND", "SUCCESS", project));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Project>>> getUserCreatedProject() {
        User user = authenticatedUser.getAuthenticatedUser();
        List<Project> projects = projectCacheService.getUserCreatedProjectsInCache(user.getId());
        if (projects.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("PROJECT NOT FOUND", "ERROR"));
        }
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECT FOUND", "SUCCESS", projects));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Project>>> getArchiveProjects() {
        List<Project> projects = projectCacheService.archivedProjects();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("ARCHIVED PROJECTS FOUND", "SUCCESS", projects));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Project>> archiveProject(String id, ProjectRequest projectRequest) {
        Project project = projectCacheService.getProjectInCacheById(id);

        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseModel.error("PROJECT NOT FOUND", "ERROR"));
        }

        project.setArchived(projectRequest.getIsArchive().equals(StringCodes.TRUE.getFlag()) ? 1 : 0);

        Project newProject = projectRepository.save(project);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("PROJECT ARCHIVED","SUCCESS", newProject));
    }
}
