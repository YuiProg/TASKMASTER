package com.example.gateway_service.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
    private String id;
    private String description;
    private Long createdAt;
    private UserDTO performedBy;
    private String taskId;
}
