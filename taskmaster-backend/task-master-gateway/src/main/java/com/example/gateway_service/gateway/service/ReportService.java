package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.ReportClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.ReportDTO;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class ReportService implements ReportClient {

    private final ReportClient reportClient;

    @Override
    public ResponseEntity<ApiResponseModel<List<ReportDTO>>> getTaskReports(String id) {
        try {
            log.info("getTaskReports REQUEST id: {}", id);
            ResponseEntity<ApiResponseModel<List<ReportDTO>>> response = reportClient.getTaskReports(id);
            log.info("getTaskReports RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;
            log.error("RESPONSE getTaskReports (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "REPORT SERVICE UNAVAILABLE", "ERROR"));
        }
    }
}
