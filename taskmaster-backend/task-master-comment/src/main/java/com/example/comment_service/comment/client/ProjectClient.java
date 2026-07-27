package com.example.comment_service.comment.client;

import com.example.comment_service.comment.dto.ApiResponseModel;
import com.example.comment_service.comment.dto.ProjectDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name = "backend-project-client", url = "http://localhost:8080/api/v1")
@FeignClient(name = "backend-project-client", url = "http://backend-service:8080/api/v1")
public interface ProjectClient {
    @GetMapping("/getProjectById/{id}")
    ApiResponseModel<ProjectDTO> getProjectById (@PathVariable("id") String id);
}
