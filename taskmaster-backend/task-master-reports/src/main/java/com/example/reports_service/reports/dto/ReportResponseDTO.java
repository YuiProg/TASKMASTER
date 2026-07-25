package com.example.reports_service.reports.dto;

import lombok.Data;

@Data
public class ReportResponseDTO {
    private String id;
    private String description;
    private Long createdAt;
    private UserDTO performedBy;
    private TaskDTO task;
}
