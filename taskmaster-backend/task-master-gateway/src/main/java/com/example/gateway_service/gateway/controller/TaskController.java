package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.TaskClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TaskDTO;
import com.example.gateway_service.gateway.request.TaskRequest;
import com.example.gateway_service.gateway.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class TaskController implements TaskClient {

    private final TaskService taskService;


    @Override
    @GetMapping("/getTaskById/{id}")
    public ResponseEntity<ApiResponseModel<TaskDTO>> getTaskById(String id) {
        return taskService.getTaskById(id);
    }

    @Override
    @PostMapping("/createTask")
    public ResponseEntity<ApiResponseModel<TaskDTO>> createTask(TaskRequest taskRequest) {
        return taskService.createTask(taskRequest);
    }
}
