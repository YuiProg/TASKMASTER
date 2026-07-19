package com.example.reports_service.reports.service;

import com.example.reports_service.reports.dto.ApiResponseModel;
import com.example.reports_service.reports.model.Report;
import com.example.reports_service.reports.request.ReportRequest;
import org.springframework.http.ResponseEntity;

public interface ReportServiceInterface {
    ResponseEntity<ApiResponseModel<Report>> newReport (ReportRequest reportRequest);
}
