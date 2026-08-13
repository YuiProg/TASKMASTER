package com.example.backend.service.TodoService;

import com.example.backend.config.AuthenticatedUser;
import com.example.backend.constants.StringCodes;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Todo;
import com.example.backend.model.User;
import com.example.backend.repository.TodoRepository;
import com.example.backend.request.TodoRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class TodoService implements TodoServiceInterface {

    private final AuthenticatedUser authenticatedUser;
    private final TodoRepository todoRepository;

    @Override
    public ResponseEntity<ApiResponseModel<Todo>> createTodo(TodoRequest todoRequest) {
        User user = authenticatedUser.getAuthenticatedUser();

        Todo todo;
        todo = new Todo();

        todo.setCreatedAt(new Date().getTime());
        todo.setCreatedBy(user);
        todo.setTodoName(todoRequest.getTodoName());
        todo.setCreatedAt(new Date().getTime());
        if (todoRequest.getDescription() != null && !todoRequest.getDescription().trim().isEmpty()) {
            todo.setDescription(todoRequest.getDescription());
        }

        todo.setUpdatedBy(user.getUsername());
        todo.setDeadline(todoRequest.getDeadline());

        Todo newTodo = todoRepository.save(todo);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseModel.success("TODO CREATED", "SUCCESS", newTodo));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Todo>> updateTodo(TodoRequest todoRequest, String id) {
        User user = authenticatedUser.getAuthenticatedUser();
        Todo todo = todoRepository.findById(id).orElse(null);
        Todo oldTodo;
        if (todo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseModel.error("TODO NOT FOUND", "ERROR"));
        }
        oldTodo = new Todo();
        oldTodo.setDescription(todo.getDescription());
        oldTodo.setCreatedBy(todo.getCreatedBy());
        oldTodo.setUpdatedBy(todo.getUpdatedBy());
        oldTodo.setTodoName(todo.getTodoName());
        oldTodo.setDeadline(todo.getDeadline());

        if (todoRequest.getTodoName() != null && !todoRequest.getTodoName().trim().isEmpty()) {
            todo.setTodoName(todoRequest.getTodoName());
        }

        if (todoRequest.getDescription() != null && !todoRequest.getDescription().trim().isEmpty()) {
            todo.setDescription(todoRequest.getDescription());
        }

        if (todoRequest.getDeadline() != null) {
            todo.setDeadline(todoRequest.getDeadline());
        }

        if (todoRequest.getCompleted() != null) {
            if (todoRequest.getCompleted().equals(StringCodes.TRUE.getFlag())) {
                todo.setFinished(StringCodes.TRUE.getCode());
            } else {
                todo.setFinished(StringCodes.FALSE.getCode());
            }
        }

        Todo updatedTodo = todoRepository.save(todo);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.update("TODO UPDATED", "SUCCESS", updatedTodo, oldTodo));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Todo>>> getAllTodos() {
        User  user = authenticatedUser.getAuthenticatedUser();
        List<Todo> todos = todoRepository.getUserTodos(user.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("TODOS FOUND", "SUCCESS", todos));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Todo>> getTodoById(String id) {
        Todo todo = todoRepository.getTodoById(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("TODO FOUND", "SUCCESS", todo));
    }
}
