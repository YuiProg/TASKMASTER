package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Todo;
import com.example.backend.request.TodoRequest;
import com.example.backend.service.TodoService.TodoService;
import com.example.backend.service.TodoService.TodoServiceInterface;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class TodoController implements TodoServiceInterface {

    private final TodoService todoService;

    @Override
    @PostMapping("/createTodo")
    public ResponseEntity<ApiResponseModel<Todo>> createTodo(@RequestBody TodoRequest todoRequest) {
        return todoService.createTodo(todoRequest);
    }

    @Override
    @PutMapping("/updateTodo/{id}")
    public ResponseEntity<ApiResponseModel<Todo>> updateTodo(
            @RequestBody TodoRequest todoRequest,
            @PathVariable String id
    ) {
        return todoService.updateTodo(todoRequest, id);
    }

    @Override
    @GetMapping("/getTodos")
    public ResponseEntity<ApiResponseModel<List<Todo>>> getAllTodos() {
        return todoService.getAllTodos();
    }
}
