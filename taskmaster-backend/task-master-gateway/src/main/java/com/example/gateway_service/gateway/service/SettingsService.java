package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.SettingsClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.SettingsDTO;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class SettingsService implements SettingsClient {

    private final SettingsClient settingsClient;

    @Override
    public ResponseEntity<ApiResponseModel<SettingsDTO>> getSettings() {
        try {
            log.info("getSettings REQUEST");
            ResponseEntity<ApiResponseModel<SettingsDTO>> response = settingsClient.getSettings();
            log.info("getSettings RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder bodyBuilder =  ResponseEntity.status(response.getStatusCode());
            return bodyBuilder.body(response.getBody());
        } catch (FeignException e) {
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;
            log.error("RESPONSE getSettings (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "SETTINGS SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<SettingsDTO>> setSettings(SettingsDTO settingsDTO) {
        try {
            log.info("setSettings REQUEST");
            ResponseEntity<ApiResponseModel<SettingsDTO>> response = settingsClient.setSettings(settingsDTO);
            log.info("setSettings RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder bodyBuilder =  ResponseEntity.status(response.getStatusCode());
            return bodyBuilder.body(response.getBody());
        } catch (FeignException e) {
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;
            log.error("RESPONSE setSettings (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "SETTINGS SERVICE UNAVAILABLE", "ERROR"));
        }
    }
}
