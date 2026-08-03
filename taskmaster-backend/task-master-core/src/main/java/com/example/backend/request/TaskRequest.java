package com.example.backend.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {
    public String id;
    public String taskName;
    public String assignee;
    public String description;
    public String project;
    public String status;
    public Long createdAt;
    public String createdBy;
    public String updatedBy;
    public String priority;
    public Integer del;
    public Integer archived;
    public Boolean toArchive;
}
