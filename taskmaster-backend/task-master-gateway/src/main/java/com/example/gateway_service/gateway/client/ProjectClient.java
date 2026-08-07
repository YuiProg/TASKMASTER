package com.example.gateway_service.gateway.client;


import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.ProjectDTO;
import com.example.gateway_service.gateway.request.AddMemberToProjectRequest;
import com.example.gateway_service.gateway.request.ProjectRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient(name = "backend-project-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-project-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface ProjectClient {

    @GetMapping("/getProjects")
    ResponseEntity<ApiResponseModel<List<ProjectDTO>>> getProjects ();

    @PostMapping("/addProject")
    ResponseEntity<ApiResponseModel<ProjectDTO>> createProject (@RequestBody ProjectRequest projectRequest);

    @GetMapping("/getProjectByName/{name}")
    ResponseEntity<ApiResponseModel<ProjectDTO>> getProjectByName (@PathVariable String name);

    @GetMapping("/getProjectById/{id}")
    ResponseEntity<ApiResponseModel<ProjectDTO>> getProjectById (@PathVariable String id);

    @GetMapping("/getUserCreatedProjects")
    ResponseEntity<ApiResponseModel<List<ProjectDTO>>> getUserCreatedProjects ();

    @PutMapping("addProjectMembers/{projectId}")
    ResponseEntity<ApiResponseModel<ProjectDTO>> addMemberToProject (@PathVariable String projectId, @RequestBody AddMemberToProjectRequest addMemberToProjectRequest);

    @PutMapping("/archiveProject/{id}")
    ResponseEntity<ApiResponseModel<ProjectDTO>> archiveProject (@PathVariable String id, @RequestBody ProjectRequest projectRequest);

    @GetMapping("/getArchiveProjects")
    ResponseEntity<ApiResponseModel<List<ProjectDTO>>> getArchiveProjects ();
}
