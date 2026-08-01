package com.example.scheduler_service.scheduler.service;

import com.example.scheduler_service.scheduler.client.TaskClient;
import com.example.scheduler_service.scheduler.dto.ApiResponseModel;
import com.example.scheduler_service.scheduler.dto.TaskDTO;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class TaskService implements TaskClient {

    private final TaskClient taskClient;

    @Override
    @Scheduled(cron = "0 59 23 * * ?", zone = "Asia/Manila")
    public ResponseEntity<ApiResponseModel<TaskDTO>> archiveTasks() {
        try {
            log.info("ARCHIVING TASKS");
            ResponseEntity<ApiResponseModel<TaskDTO>> response = taskClient.archiveTasks();
            log.info("archiveTasks RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return  builder.body(response.getBody());
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
}
