package com.example.backend.controller;

import com.example.backend.dto.AddProjectMembersDTO;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Project;
import com.example.backend.request.ProjectRequest;
import com.example.backend.service.ProjectService.ProjectServiceInterface;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class ProjectController implements ProjectServiceInterface {

    private final ProjectServiceInterface projectServiceInterface;

    @Override
    @PostMapping("/api/v1/addProject")
    public ResponseEntity<ApiResponseModel<Project>> createProject(@RequestBody ProjectRequest projectRequest) {
        return projectServiceInterface.createProject(projectRequest);
    }

    @Override
    @GetMapping("/api/v1/getProjects")
    public ResponseEntity<ApiResponseModel<List<Project>>> getProjects() {
        return projectServiceInterface.getProjects();
    }

    @Override
    @GetMapping("/api/v1/getProjectById/{projectId}")
    public ResponseEntity<ApiResponseModel<Project>> getProjectById(@PathVariable String projectId) {
        return projectServiceInterface.getProjectById(projectId);
    }

    @Override
    @PutMapping("/api/v1/addProjectMembers/{projectId}")
    public ResponseEntity<ApiResponseModel<Project>> addMemberToProject(@PathVariable String projectId, @RequestBody AddProjectMembersDTO addProjectMembersDTO) {
        return projectServiceInterface.addMemberToProject(projectId, addProjectMembersDTO);
    }

    @Override
    @PutMapping("/api/v1/removeProjectMembers/{projectId}/{userId}")
    public ResponseEntity<ApiResponseModel<Project>> removeMemberToProject(
            @PathVariable String projectId,
            @PathVariable String userId) {
        return projectServiceInterface.removeMemberToProject(projectId, userId);
    }

    @Override
    @GetMapping("/api/v1/getAuthUserProjects")
    public ResponseEntity<ApiResponseModel<List<Project>>> getAuthUserProjects() {
        return projectServiceInterface.getAuthUserProjects();
    }

    @Override
    @GetMapping("/api/v1/getProjectByName/{name}")
    public ResponseEntity<ApiResponseModel<Project>> getProjectByName(@PathVariable String name) {
        return projectServiceInterface.getProjectByName(name);
    }
}
