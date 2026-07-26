package com.example.gateway_service.gateway.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    public String id;
    public String comment;
    public String createdBy;
    public String projectId;
    public String taskId;
    public String updatedBy;
    public Integer like;
}
