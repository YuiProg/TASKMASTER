package com.example.comment_service.comment.client;

import com.example.comment_service.comment.dto.ApiResponseModel;
import com.example.comment_service.comment.dto.TaskDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name = "backend-task-client", url = "http://localhost:8080/api/v1")
@FeignClient(name = "backend-task-client", url = "http://backend-service:8080/api/v1")
public interface TaskClient {

    @GetMapping("/getTaskById/{id}")
    ApiResponseModel<TaskDTO> getTaskById (@PathVariable String id);
}
