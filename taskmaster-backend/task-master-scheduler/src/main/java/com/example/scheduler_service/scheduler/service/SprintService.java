package com.example.scheduler_service.scheduler.service;

import com.example.scheduler_service.scheduler.client.SprintClient;
import com.example.scheduler_service.scheduler.dto.ApiResponseModel;
import com.example.scheduler_service.scheduler.dto.SprintDTO;
import com.example.scheduler_service.scheduler.dto.TaskDTO;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class SprintService implements SprintClient {

    private final SprintClient sprintClient;

    @Override
    @Scheduled(cron = "0 59 23 * * ?", zone = "Asia/Manila")
    public ResponseEntity<ApiResponseModel<List<SprintDTO>>> scheduledArchiveSprints() {
        try {
            log.info("ARCHIVING FINISHED SPRINTS");
            ResponseEntity<ApiResponseModel<List<SprintDTO>>> response = sprintClient.scheduledArchiveSprints();
            log.info("ARCHIVED SPRINTS status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder bodyBuilder = ResponseEntity.status(response.getStatusCode());
            return bodyBuilder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE scheduledArchiveSprints (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            HttpStatus status = (e.status() > 0)
                    ? HttpStatus.valueOf(e.status())
                    : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Sprint service unavailable, please try again",
                            "ERROR"));
        }
    }

    @Override
    @Scheduled(cron = "0 59 23 * * 1", zone = "Asia/Manila")
    public ResponseEntity<ApiResponseModel<List<SprintDTO>>> softDeleteSprints() {
        try {
            log.info("DELETING FINISHED SPRINTS");
            ResponseEntity<ApiResponseModel<List<SprintDTO>>> response = sprintClient.softDeleteSprints();
            log.info("DELETED SPRINTS status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder bodyBuilder = ResponseEntity.status(response.getStatusCode());
            return bodyBuilder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE scheduledSoftDeleteSprints (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            HttpStatus status = (e.status() > 0)
                    ? HttpStatus.valueOf(e.status())
                    : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Sprint service unavailable, please try again",
                            "ERROR"));
        }
    }
}
