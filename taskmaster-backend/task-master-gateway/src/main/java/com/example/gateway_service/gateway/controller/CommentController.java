package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.CommentClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.CommentDTO;
import com.example.gateway_service.gateway.request.CommentRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@AllArgsConstructor
public class CommentController implements CommentClient{
    private final CommentClient commentClient;


    @Override
    @GetMapping("/getTaskComments/{id}")
    public ApiResponseModel<List<CommentDTO>> getComments(@PathVariable String id) {
        return commentClient.getComments(id);
    }

    @Override
    @PostMapping("/newComment")
    public ApiResponseModel<CommentDTO> postComment(CommentRequest commentRequest) {
        return commentClient.postComment(commentRequest);
    }
}

