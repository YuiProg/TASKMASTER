package com.example.scheduler_service.scheduler.dto;

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
    private String priority;
    private UserDTO createdBy;
    private String updatedBy;
    private Integer del;
}
