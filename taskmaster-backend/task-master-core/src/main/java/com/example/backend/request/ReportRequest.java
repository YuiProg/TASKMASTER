package com.example.backend.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReportRequest {
    public String id;
    public String description;
    public String createdAt;
    public String performedBy;
    public String taskId;
}
