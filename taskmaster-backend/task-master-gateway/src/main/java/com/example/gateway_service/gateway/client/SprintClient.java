package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.SprintDTO;
import com.example.gateway_service.gateway.request.SprintRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

//@FeignClient(name = "backend-sprint-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-project-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface SprintClient {

    @PostMapping("/createSprint")
    ResponseEntity<ApiResponseModel<SprintDTO>> createSprint(@RequestBody SprintRequest sprintRequest);

    @GetMapping("/getSprints")
    ResponseEntity<ApiResponseModel<List<SprintDTO>>> getSprints ();

    @GetMapping("/getSprintById/{id}")
    ResponseEntity<ApiResponseModel<SprintDTO>> getSprintById (@PathVariable String id);
}
