package com.example.backend.service.TodoService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Todo;
import com.example.backend.request.TodoRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TodoServiceInterface {
    ResponseEntity<ApiResponseModel<Todo>> createTodo (TodoRequest todoRequest);
    ResponseEntity<ApiResponseModel<Todo>> updateTodo(TodoRequest todoRequest, String id);
    ResponseEntity<ApiResponseModel<List<Todo>>> getAllTodos();
}
