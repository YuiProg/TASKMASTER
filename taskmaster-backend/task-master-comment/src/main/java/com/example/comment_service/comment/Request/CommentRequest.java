package com.example.comment_service.comment.Request;

import com.example.comment_service.comment.dto.UserDTO;
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
    public String image;
}
