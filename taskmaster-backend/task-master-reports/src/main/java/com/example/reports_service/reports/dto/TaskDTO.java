package com.example.reports_service.reports.dto;


import lombok.Data;

@Data
public class TaskDTO {
    private String id;
    private String taskName;
    private UserDTO assignee;
    private ProjectDTO project;
    private String description;
    private String status;
    private String createdAt;
    private UserDTO createdBy;
    private String updatedBy;
    private Integer del;
}
