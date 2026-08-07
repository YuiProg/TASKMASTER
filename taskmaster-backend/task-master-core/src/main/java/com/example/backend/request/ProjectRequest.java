package com.example.backend.request;

import com.example.backend.model.User;
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
    public String updatedBy;
    public String createdBy;
    public String status;
    public String description;
    public List<String> emails;
    public List<String> priorities;
    public Boolean isArchive;
}
