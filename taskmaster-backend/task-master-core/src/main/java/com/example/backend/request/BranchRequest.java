package com.example.backend.request;

import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BranchRequest {
    public String id;
    public String branchLocation;
    public User createdBy;
    public String createdAt;
}
