package com.example.gateway_service.gateway.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProjectRequest {
    public String id;
    public String projectName;
    public Long createdAt;
    public String createdBy;
    public String updatedBy;
    public String status;
    public String description;
    public List<String> emails;
}
