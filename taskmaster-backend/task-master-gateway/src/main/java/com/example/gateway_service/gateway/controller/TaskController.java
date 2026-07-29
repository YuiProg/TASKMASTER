package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.TaskClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TaskDTO;
import com.example.gateway_service.gateway.request.TaskRequest;
import com.example.gateway_service.gateway.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Override
    @PutMapping("/updateTaskDetail/{id}")
    public ResponseEntity<ApiResponseModel<TaskDTO>> updateTaskDetail(@PathVariable String id,@RequestBody TaskRequest taskRequest) {
        return taskService.updateTaskDetail(id, taskRequest);
    }

    @Override
    @GetMapping("/getAuthenticatedUserTask")
    public ResponseEntity<ApiResponseModel<List<TaskDTO>>> getAuthenticatedUserTask() {
        return taskService.getAuthenticatedUserTask();
    }

    @Override
    @GetMapping("/getOpenTasks")
    public ResponseEntity<ApiResponseModel<List<TaskDTO>>> getOpenTasks() {
        return taskService.getOpenTasks();
    }

    @Override
    @GetMapping("/getProjectTask/{id}")
    public ResponseEntity<ApiResponseModel<List<TaskDTO>>> getProjectTask(@PathVariable String id) {
        return taskService.getProjectTask(id);
    }

    @Override
    @PutMapping("/updateTask/{taskId}")
    public ResponseEntity<ApiResponseModel<TaskDTO>> updateTaskStatus(@PathVariable String taskId, @RequestBody TaskRequest taskRequest) {
        return taskService.updateTaskStatus(taskId, taskRequest);
    }
}
