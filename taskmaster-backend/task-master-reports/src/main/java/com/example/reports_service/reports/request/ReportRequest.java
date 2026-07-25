package com.example.reports_service.reports.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReportRequest {
    public String id;
    public String description;
    public Long createdAt;
    public String performedBy;
    public String taskId;
}
