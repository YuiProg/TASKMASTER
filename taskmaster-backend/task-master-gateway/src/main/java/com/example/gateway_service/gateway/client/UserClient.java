package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "backend-core-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
//@FeignClient(name = "backend-core-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface UserClient {
    @GetMapping("/getUserById/{id}")
    ResponseEntity<ApiResponseModel<UserDTO>> getUserById(@PathVariable String id);

    @GetMapping(value = "/getAuthUser", produces = "application/json")
    ResponseEntity<ApiResponseModel<UserDTO>> getAuthUser();

    @PostMapping(value = "/login", produces = "application/json")
    ResponseEntity<ApiResponseModel<UserDTO>> login(@RequestBody UserRequest userRequest);
}