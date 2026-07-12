package com.example.comment_service.comment.service;

import com.example.comment_service.comment.Request.CommentRequest;
import com.example.comment_service.comment.dto.ApiResponseModel;
import com.example.comment_service.comment.models.Comment;
import org.springframework.http.ResponseEntity;

public interface CommentServiceInterface {
    ResponseEntity<ApiResponseModel<Comment>> newComment (CommentRequest commentRequest);
    ResponseEntity<ApiResponseModel<Comment>> editComment (String id, CommentRequest commentRequest);
}
