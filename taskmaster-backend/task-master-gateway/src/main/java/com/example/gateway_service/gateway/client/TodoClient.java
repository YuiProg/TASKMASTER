package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TodoDTO;
import com.example.gateway_service.gateway.request.TodoRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

//@FeignClient(name = "backend-todo-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-todo-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface TodoClient {

    @PostMapping("/createTodo")
    ResponseEntity<ApiResponseModel<TodoDTO>> createTodo (@RequestBody TodoRequest todoRequest);

    @GetMapping("/getTodos")
    ResponseEntity<ApiResponseModel<List<TodoDTO>>> getTodos();

}
