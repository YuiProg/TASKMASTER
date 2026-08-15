package com.example.gateway_service.gateway.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String role;
    private Integer del;
    private BranchDTO branchLocation;
    private String profilePicture;
    private String profilePictureId;
}
