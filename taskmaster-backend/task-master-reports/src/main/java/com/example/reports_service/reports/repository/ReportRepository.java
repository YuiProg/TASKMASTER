package com.example.reports_service.reports.repository;

import com.example.reports_service.reports.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, String> {
}
