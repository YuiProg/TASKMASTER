package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.TaskClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TaskDTO;
import com.example.gateway_service.gateway.request.TaskRequest;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class TaskService implements TaskClient {

    private final TaskClient taskClient;

    @Override
    public ResponseEntity<ApiResponseModel<TaskDTO>> getTaskById(String id) {
        log.info("REQUEST getTaskById -> id: {}", id);
        try {
            ResponseEntity<ApiResponseModel<TaskDTO>> response = taskClient.getTaskById(id);
            log.info("RESPONSE getTaskById -> httpStatus: {}", response.getStatusCode());

            return ResponseEntity
                    .status(response.getStatusCode())
                    .body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE getTaskById (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            HttpStatus status = (e.status() > 0)
                    ? HttpStatus.valueOf(e.status())
                    : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Task service unavailable, please try again",
                            "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<TaskDTO>> createTask(TaskRequest taskRequest) {
        log.info("createTask REQUEST data: {}", taskRequest);
        try {
            ResponseEntity<ApiResponseModel<TaskDTO>> response = taskClient.createTask(taskRequest);
            log.info("createTask RESPONSE status: {}, data: {}", response.getStatusCode(), response.getBody());

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE getTaskById (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Task service unavailable, please try again",
                            "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<TaskDTO>> updateTaskDetail(String id, TaskRequest taskRequest) {
        try {
            log.info("updateTaskDetail REQUEST id: {}", id);
            ResponseEntity<ApiResponseModel<TaskDTO>> response = taskClient.updateTaskDetail(id, taskRequest);
            log.info("updateTaskDetail RESPONSE id: {} data: {}", id, response.getBody());

            return ResponseEntity.status(response.getStatusCode())
                    .body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE getTaskById (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Task service unavailable, please try again",
                            "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<TaskDTO>>> getAuthenticatedUserTask() {
        try {
            log.info("getAuthenticatedUserTask REQUEST");
            ResponseEntity<ApiResponseModel<List<TaskDTO>>> response = taskClient.getAuthenticatedUserTask();
            log.info("getAuthenticatedUserTask RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE getTaskById (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Task service unavailable, please try again",
                            "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<TaskDTO>>> getOpenTasks() {
        try {
            log.info("getOpenTasks REQUEST");
            ResponseEntity<ApiResponseModel<List<TaskDTO>>> response = taskClient.getOpenTasks();
            log.info("getOpenTasks RESPONSE data: {}", response.getBody());

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE getTaskById (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Task service unavailable, please try again",
                            "ERROR"));
        }
    }
}