package com.example.comment_service.comment.controller;

import com.example.comment_service.comment.Request.CommentRequest;
import com.example.comment_service.comment.client.UserClient;
import com.example.comment_service.comment.dto.ApiResponseModel;
import com.example.comment_service.comment.dto.UserDTO;
import com.example.comment_service.comment.models.Comment;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.comment_service.comment.service.CommentServiceInterface;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@AllArgsConstructor
public class CommentController implements CommentServiceInterface {

    private final CommentServiceInterface commentServiceInterface;
    private final UserClient userClient;

    @Override
    @PostMapping("/newComment")
    public ResponseEntity<ApiResponseModel<Comment>> newComment(@RequestBody CommentRequest commentRequest) {
        return commentServiceInterface.newComment(commentRequest);
    }

    @Override
    @PostMapping("/updateComment/{id}")
    public ResponseEntity<ApiResponseModel<Comment>> editComment(@PathVariable String id, @RequestBody CommentRequest commentRequest) {
        return commentServiceInterface.editComment(id, commentRequest);
    }

    @Override
    @GetMapping("/getTaskComments/{id}")
    public ResponseEntity<ApiResponseModel<List<Comment>>> getTaskComments(@PathVariable String id) {
        return commentServiceInterface.getTaskComments(id);
    }

    @GetMapping("/test-feign/{id}")
    public ResponseEntity<ApiResponseModel<UserDTO>> testFeignConnection(@PathVariable String id) {
        // This directly calls your Feign client interface
        return ResponseEntity.ok(userClient.getUserById(id));
    }
}