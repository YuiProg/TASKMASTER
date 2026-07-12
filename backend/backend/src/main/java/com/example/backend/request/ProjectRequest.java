package com.example.backend.request;

import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProjectRequest {
    public String id;
    public String projectName;
    public String createdAt;
    public String updatedBy;
    public String status;
}
