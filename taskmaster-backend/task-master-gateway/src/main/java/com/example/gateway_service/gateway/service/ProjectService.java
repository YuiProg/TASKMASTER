package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.ProjectClient;
import com.example.gateway_service.gateway.config.JwtUtil;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.ProjectDTO;
import com.example.gateway_service.gateway.request.AddMemberToProjectRequest;
import com.example.gateway_service.gateway.request.ProjectRequest;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class ProjectService implements ProjectClient {

    private final ProjectClient projectClient;
    private final JwtUtil jwtUtil;

    @Override
    public ResponseEntity<ApiResponseModel<List<ProjectDTO>>> getProjects() {
        try {
            log.info("getProjects REQUEST");
            ResponseEntity<ApiResponseModel<List<ProjectDTO>>> projects = projectClient.getProjects();
            log.info("getProjects RESPONSE status: {} data: {}", projects.getStatusCode(), projects.getBody());

            return ResponseEntity.status(projects.getStatusCode())
                    .body(projects.getBody());

        } catch (FeignException e) {
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "PROJECT SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<ProjectDTO>> createProject(ProjectRequest projectRequest) {
        try {

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            if (attributes == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
            }

            String token = jwtUtil.extractTokenFromCookie(attributes.getRequest());
            String id = jwtUtil.extractSubject(token);

            projectRequest.setCreatedBy(id);

            log.info("createProject REQUEST data: {}", projectRequest.getProjectName());
            ResponseEntity<ApiResponseModel<ProjectDTO>> response = projectClient.createProject(projectRequest);
            log.info("createProject RESPONSE data: {}", response.getBody());

            return ResponseEntity.status(response.getStatusCode())
                    .body(response.getBody());

        } catch (FeignException e) {
            log.info("ADD PROJECT FAILED status: {} message: {}", e.status(), e.contentUTF8());
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "PROJECT SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<ProjectDTO>> getProjectByName(String name) {
        try {
            log.info("getProjectByName REQUEST name: {}", name);
            ResponseEntity<ApiResponseModel<ProjectDTO>> response = projectClient.getProjectByName(name);
            log.info("getProjectByName RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            log.info("getProjectByName FAILED status: {} message: {}", e.status(), e.contentUTF8());
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "PROJECT SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<ProjectDTO>>> getUserCreatedProjects() {
        try {
            log.info("getUserCreatedProjects REQUEST");
            ResponseEntity<ApiResponseModel<List<ProjectDTO>>> response = projectClient.getUserCreatedProjects();
            log.info("getUserCreatedProjects RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());
        } catch (FeignException e) {
            log.info("getUserCreatedProjects FAILED status: {} message: {}", e.status(), e.contentUTF8());
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "PROJECT SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<ProjectDTO>> addMemberToProject(String projectId, AddMemberToProjectRequest addMemberToProjectRequest) {
        try {

            ResponseEntity<ApiResponseModel<ProjectDTO>> response = projectClient.addMemberToProject(projectId, addMemberToProjectRequest);
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());
        } catch (FeignException e) {
            log.info("addMemberToProject FAILED status: {} message: {}", e.status(), e.contentUTF8());
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "PROJECT SERVICE UNAVAILABLE", "ERROR"));
        }
    }
}
