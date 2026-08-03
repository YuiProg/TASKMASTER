package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TaskDTO;
import com.example.gateway_service.gateway.request.TaskRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient(name = "backend-task-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-task-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface TaskClient {

    @GetMapping(value = "/getTaskById/{id}", consumes = "application/json", produces = "application/json")
    ResponseEntity<ApiResponseModel<TaskDTO>> getTaskById (@PathVariable String id);

    @PostMapping(value = "/createTask", consumes = "application/json", produces = "application/json")
    ResponseEntity<ApiResponseModel<TaskDTO>> createTask (@RequestBody TaskRequest taskRequest);

    @PutMapping("/updateTaskDetail/{id}")
    ResponseEntity<ApiResponseModel<TaskDTO>> updateTaskDetail (@PathVariable String id, @RequestBody TaskRequest taskRequest);

    @GetMapping("/getAuthenticatedUserTask")
    ResponseEntity<ApiResponseModel<List<TaskDTO>>> getAuthenticatedUserTask ();

    @GetMapping("/getOpenTasks")
    ResponseEntity<ApiResponseModel<List<TaskDTO>>> getOpenTasks ();

    @GetMapping("/getProjectTask/{id}")
    ResponseEntity<ApiResponseModel<List<TaskDTO>>> getProjectTask (@PathVariable String id);

    @PutMapping("/updateTask/{taskId}")
    ResponseEntity<ApiResponseModel<TaskDTO>> updateTaskStatus (@PathVariable String taskId, @RequestBody TaskRequest taskRequest);

    @GetMapping("/getArchiveTasks")
    ResponseEntity<ApiResponseModel<List<TaskDTO>>> getArchivedTasks ();

    @PutMapping("/updateToArchive/{id}")
    ResponseEntity<ApiResponseModel<TaskDTO>> updateToArchive (@PathVariable String id, @RequestBody TaskRequest toArchive);
}
