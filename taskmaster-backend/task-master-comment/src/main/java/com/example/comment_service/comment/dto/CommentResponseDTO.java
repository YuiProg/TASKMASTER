package com.example.comment_service.comment.dto;

import lombok.Data;

@Data
public class CommentResponseDTO {
    private String id;
    private String comment;
    private UserDTO createdBy;
    private String updatedBy;
    private Integer like;
    private TaskDTO task;
}
