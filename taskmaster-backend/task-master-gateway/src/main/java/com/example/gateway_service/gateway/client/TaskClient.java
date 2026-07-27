package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TaskDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name = "backend-task-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-task-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface TaskClient {

    @GetMapping(value = "/getTaskById/{id}", consumes = "application/json", produces = "application/json")
    ResponseEntity<ApiResponseModel<TaskDTO>> getTaskById (@PathVariable String id);
}
