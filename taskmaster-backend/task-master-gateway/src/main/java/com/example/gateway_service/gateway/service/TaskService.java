package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.TaskClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.TaskDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TaskService implements TaskClient {

    private final TaskClient taskClient;

    @Override
    public ResponseEntity<ApiResponseModel<TaskDTO>> getTaskById(String id) {
        return taskClient.getTaskById(id);
    }
}
