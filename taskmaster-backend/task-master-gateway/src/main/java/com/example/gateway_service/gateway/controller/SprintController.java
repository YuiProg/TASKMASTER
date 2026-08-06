package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.SprintClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.SprintDTO;
import com.example.gateway_service.gateway.request.SprintRequest;
import com.example.gateway_service.gateway.service.SprintService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class SprintController implements SprintClient {

    private final SprintService service;

    @Override
    @PostMapping("/createSprint")
    public ResponseEntity<ApiResponseModel<SprintDTO>> createSprint(@RequestBody SprintRequest sprintRequest) {
        return service.createSprint(sprintRequest);
    }

    @Override
    @GetMapping("/getSprints")
    public ResponseEntity<ApiResponseModel<List<SprintDTO>>> getSprints() {
        return service.getSprints();
    }

    @Override
    @GetMapping("/getSprintById/{id}")
    public ResponseEntity<ApiResponseModel<SprintDTO>> getSprintById(@PathVariable String id) {
        return service.getSprintById(id);
    }
}
