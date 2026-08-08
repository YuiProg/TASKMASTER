package com.example.gateway_service.gateway.dto;


import lombok.Data;

@Data
public class CommentDTO {
    private String id;
    private String comment;
    private UserDTO createdBy;
    private String updatedBy;
    private Integer like;
    private TaskDTO task;
    private String imageUrl;
    private String imageId;
}
