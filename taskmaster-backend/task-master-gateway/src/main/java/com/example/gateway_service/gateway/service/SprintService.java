package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.SprintClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.SprintDTO;
import com.example.gateway_service.gateway.request.SprintRequest;
import feign.FeignException;
import feign.Response;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class SprintService implements SprintClient {

    private final SprintClient sprintClient;

    @Override
    public ResponseEntity<ApiResponseModel<SprintDTO>> createSprint(SprintRequest sprintRequest) {
        try {
            log.info("createSprint REQUEST data: {}", sprintRequest);
            ResponseEntity<ApiResponseModel<SprintDTO>> response = sprintClient.createSprint(sprintRequest);
            log.info("createSprint RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());
        } catch (FeignException e) {
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;
            log.error("RESPONSE createSprint (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "SPRINT SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<SprintDTO>>> getSprints() {
        try {
            log.info("getSprints REQUEST");
            ResponseEntity<ApiResponseModel<List<SprintDTO>>> response = sprintClient.getSprints();
            log.info("getSprints RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;
            log.error("RESPONSE getSprints (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "SPRINT SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<SprintDTO>> getSprintById(String id) {
        try {
            log.info("getSprintById REQUEST id: {}", id);
            ResponseEntity<ApiResponseModel<SprintDTO>> response = sprintClient.getSprintById(id);
            log.info("getSprintById RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());
            return builder.body(response.getBody());
        } catch (FeignException e) {
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;
            log.error("RESPONSE getSprintById (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "SPRINT SERVICE UNAVAILABLE", "ERROR"));
        }
    }
}
