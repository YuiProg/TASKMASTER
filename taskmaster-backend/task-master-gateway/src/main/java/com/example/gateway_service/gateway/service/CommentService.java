package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.CommentClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.CommentDTO;
import com.example.gateway_service.gateway.request.CommentRequest;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class CommentService implements CommentClient {

    private final CommentClient commentClient;

    @Override
    public ResponseEntity<ApiResponseModel<List<CommentDTO>>> getComments(String id) {
        try {
            log.info("getComments REQUEST id: {}", id);
            ResponseEntity<ApiResponseModel<List<CommentDTO>>> response = commentClient.getComments(id);
            log.info("getComments RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE getComments (error) -> status: {}, cause: {}", e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(ApiResponseModel.error("SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<CommentDTO>> postComment(CommentRequest commentRequest) {
        try {
            log.info("postComment REQUEST");
            ResponseEntity<ApiResponseModel<CommentDTO>> response = commentClient.postComment(commentRequest);
            log.info("postComment RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE getComments (error) -> status: {}, cause: {}", e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(ApiResponseModel.error("SERVICE UNAVAILABLE", "ERROR"));
        }
    }
}
