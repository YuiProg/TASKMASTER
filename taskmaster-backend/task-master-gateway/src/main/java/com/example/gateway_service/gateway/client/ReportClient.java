package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.ReportDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "backend-reports-service", url = "http://localhost:8082/api/v1/report", configuration = FeignCookieConfig.class)
//@FeignClient(name = "backend-reports-service", url = "${services.report.url}", configuration = FeignCookieConfig.class)
public interface ReportClient {

    @GetMapping(value = "/getReports/{id}", consumes = "application/json", produces = "application/json")
    ResponseEntity<ApiResponseModel<List<ReportDTO>>> getTaskReports (@PathVariable String id);
}
