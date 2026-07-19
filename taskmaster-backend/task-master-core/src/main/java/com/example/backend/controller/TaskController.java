package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Task;
import com.example.backend.request.TaskRequest;
import com.example.backend.service.TaskService.TaskServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TaskController implements TaskServiceInterface {
    private final TaskServiceInterface taskServiceInterface;

    @Override
    @PostMapping("/api/v1/createTask")
    public ResponseEntity<ApiResponseModel<Task>> createTask(@RequestBody TaskRequest taskRequest) {
        return taskServiceInterface.createTask(taskRequest);
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getAllTask(String status) {
        return null;
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getTasksByAssignee(Long userId) {
        return null;
    }

    @Override
    public ResponseEntity<ApiResponseModel<Task>> updateTask(TaskRequest taskRequest) {
        return null;
    }

    @Override
    @GetMapping("/api/v1/getAuthenticatedUserTask")
    public ResponseEntity<ApiResponseModel<List<Task>>> getAuthenticatedUserTask() {
        return taskServiceInterface.getAuthenticatedUserTask();
    }

    @Override
    @PutMapping("/api/v1/updateTask/{taskId}")
    public ResponseEntity<ApiResponseModel<Task>> updateTaskStatus(@PathVariable String taskId, @RequestBody TaskRequest taskRequest) {
        return taskServiceInterface.updateTaskStatus(taskId, taskRequest);
    }

    @Override
    @GetMapping("/api/v1/getTaskById/{id}")
    public ResponseEntity<ApiResponseModel<Task>> getTaskById(@PathVariable String id) {
        return taskServiceInterface.getTaskById(id);
    }

    @Override
    @GetMapping("/api/v1/getProjectTask/{id}")
    public ResponseEntity<ApiResponseModel<List<Task>>> getProjectTask(@PathVariable String id) {
        return taskServiceInterface.getProjectTask(id);
    }

    @Override
    @GetMapping("/api/v1/getOpenTasks")
    public ResponseEntity<ApiResponseModel<List<Task>>> getAllOpenTask() {
        return taskServiceInterface.getAllOpenTask();
    }
}
