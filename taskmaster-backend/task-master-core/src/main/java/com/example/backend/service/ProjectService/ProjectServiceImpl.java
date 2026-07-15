package com.example.backend.service.ProjectService;

import com.example.backend.config.AuthenticatedUser;
import com.example.backend.config.JwtUtil;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Project;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.ProjectRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectServiceInterface{

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final AuthenticatedUser authenticatedUser;
    private final ProjectRepository projectRepository;

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Project>> createProject(ProjectRequest projectRequest) {
        User user = authenticatedUser.getAuthenticatedUser();

        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseModel.error("NOT LOGGED IN", "ERROR"));
        }

        Project project;

        project = new Project();
        project.setProjectName(projectRequest.getProjectName());
        project.setCreatedBy(user);
        project.setProjectName(projectRequest.getProjectName());
        project.setCreatedAt(String.valueOf(new Date()));
        project.setUpdatedBy(user.getUsername());
        project.setDescription(projectRequest.getDescription());

        if (projectRequest.getStatus() != null && !projectRequest.getStatus().trim().isEmpty()) {
            project.setStatus(projectRequest.getStatus());
        }

        Project newProject = projectRepository.save(project);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseModel.success("PROJECT CREATED", "SUCCESS", newProject));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Project>>> getProjects() {
        List<Project> projects = projectRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJCETS FOUND", "SUCCESS", projects));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Project>> getProjectById(String id) {
        Project project = projectRepository.findById(id).orElse(null);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECT FOUND", "SUCCESS", project));
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Project>> addMemberToProject(String projectId, String userId) {
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

            if (project.getMembers().contains(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponseModel.error("User is already a member of this project", "ERROR"));
            }

            project.getMembers().add(user);
            Project updatedProject = projectRepository.save(project);

            return ResponseEntity.ok(
                    ApiResponseModel.success("MEMBER ADDED TO PROJECT", "SUCCESS", updatedProject));

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
        Project project = projectRepository.getProjectByName(name);
        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("PROJECT NOT FOUND", "ERROR"));
        }
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PROJECT FOUND", "SUCCESS", project));
    }
}
