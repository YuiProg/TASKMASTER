package com.example.reports_service.reports.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String role;
    private Integer del;
    private BranchDTO branchLocation;
}
