package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.ProjectClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.ProjectDTO;
import com.example.gateway_service.gateway.request.AddMemberToProjectRequest;
import com.example.gateway_service.gateway.request.ProjectRequest;
import com.example.gateway_service.gateway.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class ProjectController implements ProjectClient {

    private final ProjectService projectService;

    @Override
    @GetMapping("/getProjects")
    public ResponseEntity<ApiResponseModel<List<ProjectDTO>>> getProjects() {
        return projectService.getProjects();
    }

    @Override
    @PostMapping("/addProject")
    public ResponseEntity<ApiResponseModel<ProjectDTO>> createProject(@RequestBody ProjectRequest projectRequest) {
        return projectService.createProject(projectRequest);
    }

    @Override
    @GetMapping("/getProjectByName/{name}")
    public ResponseEntity<ApiResponseModel<ProjectDTO>> getProjectByName(@PathVariable String name) {
        return projectService.getProjectByName(name);
    }

    @Override
    @GetMapping("/getUserCreatedProjects")
    public ResponseEntity<ApiResponseModel<List<ProjectDTO>>> getUserCreatedProjects() {
        return projectService.getUserCreatedProjects();
    }

    @Override
    @PutMapping("addProjectMembers/{projectId}")
    public ResponseEntity<ApiResponseModel<ProjectDTO>> addMemberToProject(@PathVariable String projectId, @RequestBody AddMemberToProjectRequest addMemberToProjectRequest) {
        return projectService.addMemberToProject(projectId, addMemberToProjectRequest);
    }
}
