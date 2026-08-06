package com.example.backend.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SprintRequest {
    public String id;
    public String sprintName;
    public String projectId;
    public String initiatedBy;
    public String updatedBy;
    public Long deadline;
    public List<String> taskIds;
}
