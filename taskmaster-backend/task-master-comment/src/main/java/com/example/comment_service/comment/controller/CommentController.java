package com.example.comment_service.comment.controller;

import com.example.comment_service.comment.Request.CommentRequest;
import com.example.comment_service.comment.client.UserClient;
import com.example.comment_service.comment.dto.ApiResponseModel;
import com.example.comment_service.comment.dto.CommentResponseDTO;
import com.example.comment_service.comment.dto.UserDTO;
import com.example.comment_service.comment.models.Comment;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.comment_service.comment.service.CommentServiceInterface;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/comments")
@AllArgsConstructor
public class CommentController implements CommentServiceInterface {

    private final CommentServiceInterface commentServiceInterface;
    private final UserClient userClient;

    @Override
    @PostMapping("/newComment")
    public ResponseEntity<ApiResponseModel<CommentResponseDTO>> newComment(@RequestBody CommentRequest commentRequest) {
        return commentServiceInterface.newComment(commentRequest);
    }

    @Override
    @PostMapping("/updateComment/{id}")
    public ResponseEntity<ApiResponseModel<Comment>> editComment(@PathVariable String id, @RequestBody CommentRequest commentRequest) {
        return commentServiceInterface.editComment(id, commentRequest);
    }

    @Override
    @GetMapping("/getTaskComments/{id}")
    public ResponseEntity<ApiResponseModel<List<CommentResponseDTO>>> getTaskComments(@PathVariable String id) {
        return commentServiceInterface.getTaskComments(id);
    }

    //to be tested
    @Override
    @DeleteMapping("/deleteComment/{id}")
    public ResponseEntity<ApiResponseModel<CommentResponseDTO>> deleteComment(@PathVariable String id) {
        return commentServiceInterface.deleteComment(id);
    }

    @GetMapping("/test-feign/{id}")
    public ResponseEntity<ApiResponseModel<UserDTO>> testFeignConnection(@PathVariable String id) {
        // This directly calls your Feign client interface
        return ResponseEntity.ok(userClient.getUserById(id));
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> pingComment () {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "comment-service"
        ));
    }
}