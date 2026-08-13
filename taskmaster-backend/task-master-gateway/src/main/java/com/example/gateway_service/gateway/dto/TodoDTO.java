package com.example.gateway_service.gateway.dto;

import lombok.Data;

@Data
public class TodoDTO {
    private String id;
    private String todoName;
    private String description;
    private Long deadline;
    private String updatedBy;
    private Long createdAt;
    private UserDTO createdBy;
    private Integer finished;
    private Integer del;
}
