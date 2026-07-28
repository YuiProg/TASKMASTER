package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.CommentClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.CommentDTO;
import com.example.gateway_service.gateway.request.CommentRequest;
import com.example.gateway_service.gateway.service.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@AllArgsConstructor
public class CommentController implements CommentClient{
    private final CommentService commentService;


    @Override
    @GetMapping("/getTaskComments/{id}")
    public ResponseEntity<ApiResponseModel<List<CommentDTO>>> getComments(@PathVariable String id) {
        return commentService.getComments(id);
    }

    @Override
    @PostMapping("/newComment")
    public ResponseEntity<ApiResponseModel<CommentDTO>> postComment(@RequestBody CommentRequest commentRequest) {
        return commentService.postComment(commentRequest);
    }
}

