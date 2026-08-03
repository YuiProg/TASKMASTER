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
    @PutMapping("/api/v1/updateTaskDetail/{id}")
    public ResponseEntity<ApiResponseModel<Task>> updateTask(@PathVariable String id, @RequestBody TaskRequest taskRequest) {
        return taskServiceInterface.updateTask(id, taskRequest);
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

    @Override
    @PutMapping("/api/v1/archiveTasks")
    public ResponseEntity<ApiResponseModel<List<Task>>> archiveTasks() {
        return taskServiceInterface.archiveTasks();
    }

    @Override
    @GetMapping("/api/v1/getArchiveTasks")
    public ResponseEntity<ApiResponseModel<List<Task>>> getArchiveTasks() {
        return taskServiceInterface.getArchiveTasks();
    }

    @Override
    @PutMapping("/api/v1/updateToArchive/{id}")
    public ResponseEntity<ApiResponseModel<Task>> setToArchive(@PathVariable String id, @RequestBody TaskRequest toArchive) {
        return taskServiceInterface.setToArchive(id, toArchive);
    }
}
