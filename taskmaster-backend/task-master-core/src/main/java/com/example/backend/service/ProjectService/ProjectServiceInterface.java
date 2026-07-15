package com.example.backend.service.ProjectService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Project;
import com.example.backend.request.ProjectRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProjectServiceInterface {
    ResponseEntity<ApiResponseModel<Project>> createProject (ProjectRequest projectRequest);
    ResponseEntity<ApiResponseModel<List<Project>>> getProjects ();
    ResponseEntity<ApiResponseModel<Project>> getProjectById (String id);
    ResponseEntity<ApiResponseModel<Project>> addMemberToProject (String projectId, String userId);
    ResponseEntity<ApiResponseModel<Project>> removeMemberToProject (String projectId, String userId);
    ResponseEntity<ApiResponseModel<List<Project>>> getAuthUserProjects ();
    ResponseEntity<ApiResponseModel<Project>> getProjectByName (String name);
}
