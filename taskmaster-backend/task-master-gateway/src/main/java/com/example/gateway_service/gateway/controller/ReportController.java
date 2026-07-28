package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.ReportClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.ReportDTO;
import com.example.gateway_service.gateway.service.ReportService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/report")
@AllArgsConstructor
public class ReportController implements ReportClient {

    private final ReportService reportService;

    @Override
    @GetMapping("/getReports/{id}")
    public ResponseEntity<ApiResponseModel<List<ReportDTO>>> getTaskReports(@PathVariable String id) {
        return reportService.getTaskReports(id);
    }
}
