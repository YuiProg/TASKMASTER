package com.example.reports_service.reports.service;

import com.example.reports_service.reports.dto.ApiResponseModel;
import com.example.reports_service.reports.dto.ReportResponseDTO;
import com.example.reports_service.reports.model.Report;
import com.example.reports_service.reports.request.ReportRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReportServiceInterface {
    ResponseEntity<ApiResponseModel<Report>> newReport (ReportRequest reportRequest);
    ResponseEntity<ApiResponseModel<List<ReportResponseDTO>>> getTaskReports (String id);
}
