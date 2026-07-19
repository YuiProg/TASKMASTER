package com.example.reports_service.reports.controller;

import com.example.reports_service.reports.dto.ApiResponseModel;
import com.example.reports_service.reports.model.Report;
import com.example.reports_service.reports.request.ReportRequest;
import com.example.reports_service.reports.service.ReportServiceInterface;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/report")
@AllArgsConstructor
public class ReportController implements ReportServiceInterface {

    private final ReportServiceInterface reportServiceInterface;

    @Override
    @PostMapping("/newReport")
    public ResponseEntity<ApiResponseModel<Report>> newReport(@RequestBody ReportRequest reportRequest) {
        return reportServiceInterface.newReport(reportRequest);
    }
}