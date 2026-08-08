package com.example.comment_service.comment.service;

import com.example.comment_service.comment.Request.CommentRequest;
import com.example.comment_service.comment.dto.ApiResponseModel;
import com.example.comment_service.comment.dto.CommentResponseDTO;
import com.example.comment_service.comment.models.Comment;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CommentServiceInterface {
    ResponseEntity<ApiResponseModel<CommentResponseDTO>> newComment (CommentRequest commentRequest);
    ResponseEntity<ApiResponseModel<Comment>> editComment (String id, CommentRequest commentRequest);
    ResponseEntity<ApiResponseModel<List<CommentResponseDTO>>> getTaskComments (String taskId);
    ResponseEntity<ApiResponseModel<CommentResponseDTO>> deleteComment (String id);
}
