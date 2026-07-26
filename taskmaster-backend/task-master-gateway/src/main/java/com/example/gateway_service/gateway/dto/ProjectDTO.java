package com.example.gateway_service.gateway.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProjectDTO {
    private String projectName;
    private UserDTO createdBy;
    private String createdAt;
    private String updatedBy;
    private String status;
    private List<UserDTO> members;
}
