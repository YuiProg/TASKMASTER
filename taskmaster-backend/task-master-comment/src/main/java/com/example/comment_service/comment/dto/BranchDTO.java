package com.example.comment_service.comment.dto;

import lombok.Data;

@Data
public class BranchDTO {
    private String id;
    private String branchLocation;
    private String createdAt;
    private UserDTO createdBy;
}
