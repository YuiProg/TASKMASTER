package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.CommentDTO;
import com.example.gateway_service.gateway.request.CommentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

//@FeignClient(name = "backend-comment-service", url = "http://localhost:8081/api/v1/comments", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-comment-service", url = "${services.comment.url}", configuration = FeignCookieConfig.class)
public interface CommentClient {

    @GetMapping(value = "/getTaskComments/{id}", produces = "application/json")
    ResponseEntity<ApiResponseModel<List<CommentDTO>>> getComments (@PathVariable String id);

    @GetMapping(value = "/newComment")
    ApiResponseModel<CommentDTO> postComment (@RequestBody CommentRequest commentRequest);
}
