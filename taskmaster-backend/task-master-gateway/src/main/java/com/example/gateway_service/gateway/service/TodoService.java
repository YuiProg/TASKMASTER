package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.TodoClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TodoDTO;
import com.example.gateway_service.gateway.request.TodoRequest;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class TodoService implements TodoClient {

    private final TodoClient todoClient;

    @Override
    public ResponseEntity<ApiResponseModel<TodoDTO>> createTodo(TodoRequest todoRequest) {
        try {
            log.info("createTodo REQUEST");
            ResponseEntity<ApiResponseModel<TodoDTO>> response = todoClient.createTodo(todoRequest);
            log.info("createTodo RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody().getData());
            ResponseEntity.BodyBuilder bodyBuilder = ResponseEntity.status(response.getStatusCode());
            return bodyBuilder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE createTodo (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            HttpStatus status = (e.status() > 0)
                    ? HttpStatus.valueOf(e.status())
                    : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Todo service unavailable, please try again",
                            "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<TodoDTO>>> getTodos() {
        try {
            log.info("getTodos REQUEST");
            ResponseEntity<ApiResponseModel<List<TodoDTO>>> response = todoClient.getTodos();
            log.info("getTodos RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody().getData());
            ResponseEntity.BodyBuilder bodyBuilder = ResponseEntity.status(response.getStatusCode());
            return bodyBuilder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE getTodos (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            HttpStatus status = (e.status() > 0)
                    ? HttpStatus.valueOf(e.status())
                    : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Todo service unavailable, please try again",
                            "ERROR"));
        }
    }
}
