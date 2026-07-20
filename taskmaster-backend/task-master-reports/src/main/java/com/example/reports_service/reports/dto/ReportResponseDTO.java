package com.example.reports_service.reports.dto;

import lombok.Data;

@Data
public class ReportResponseDTO {
    private String id;
    private String description;
    private String createdAt;
    private UserDTO performedBy;
    private TaskDTO task;
}
