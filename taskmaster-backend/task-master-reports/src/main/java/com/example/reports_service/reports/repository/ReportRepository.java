package com.example.reports_service.reports.repository;

import com.example.reports_service.reports.dto.ReportResponseDTO;
import com.example.reports_service.reports.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, String> {

    @Query(value = "SELECT r.* FROM reports r WHERE r.task_id = :taskId", nativeQuery = true)
    List<Report> getTaskReports (@Param("taskId") String taskId);
}
