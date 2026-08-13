package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.TodoClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TodoDTO;
import com.example.gateway_service.gateway.request.TodoRequest;
import com.example.gateway_service.gateway.service.TodoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class TodoController implements TodoClient {

    private final TodoService todoService;

    @Override
    @PostMapping("/createTodo")
    public ResponseEntity<ApiResponseModel<TodoDTO>> createTodo(@RequestBody TodoRequest todoRequest) {
        return todoService.createTodo(todoRequest);
    }

    @Override
    @GetMapping("/getTodos")
    public ResponseEntity<ApiResponseModel<List<TodoDTO>>> getTodos() {
        return todoService.getTodos();
    }
}
