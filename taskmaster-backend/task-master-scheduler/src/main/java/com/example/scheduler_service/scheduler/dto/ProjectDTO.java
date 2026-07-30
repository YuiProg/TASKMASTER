package com.example.scheduler_service.scheduler.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProjectDTO {
    private String id;
    private String projectName;
    private UserDTO createdBy;
    private String createdAt;
    private String updatedBy;
    private String status;
    private List<UserDTO> members;
}
