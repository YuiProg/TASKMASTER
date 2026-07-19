package com.example.reports_service.reports.service;

import com.example.reports_service.reports.client.UserClient;
import com.example.reports_service.reports.config.AuthenticatedUser;
import com.example.reports_service.reports.dto.ApiResponseModel;
import com.example.reports_service.reports.dto.UserDTO;
import com.example.reports_service.reports.model.Report;
import com.example.reports_service.reports.repository.ReportRepository;
import com.example.reports_service.reports.request.ReportRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@AllArgsConstructor
@Slf4j
public class ReportService implements ReportServiceInterface{

    private final UserClient userClient;
    private final ReportRepository reportRepository;
    private final AuthenticatedUser authenticatedUser;

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Report>> newReport(ReportRequest reportRequest) {
        try {
            Report report;

            UserDTO user = authenticatedUser.getAuthenticatedUser();

            report = new Report();

            report.setDescription(reportRequest.getDescription());
            report.setCreatedAt(String.valueOf(new Date()));
            report.setPerformedBy(reportRequest.getPerformedBy());
            report.setTaskId(reportRequest.getTaskId());

            Report newReport = reportRepository.save(report);

            return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("REPORT POSTED", "SUCCESS", newReport));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseModel.error(e.getMessage(), "ERROR"));
        }
    }
}
