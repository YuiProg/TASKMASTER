package com.example.backend.service.TaskService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Task;
import com.example.backend.request.TaskRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TaskServiceInterface {
    ResponseEntity<ApiResponseModel<Task>> createTask (TaskRequest taskRequest);
    ResponseEntity<ApiResponseModel<List<Task>>> getAllTask (String status);
    ResponseEntity<ApiResponseModel<List<Task>>> getTasksByAssignee (Long userId);
    ResponseEntity<ApiResponseModel<Task>> updateTask (TaskRequest taskRequest);
    ResponseEntity<ApiResponseModel<List<Task>>> getAuthenticatedUserTask ();
    ResponseEntity<ApiResponseModel<Task>> updateTaskStatus(String taskId, TaskRequest taskRequest);
    ResponseEntity<ApiResponseModel<Task>> getTaskById (String id);
}
