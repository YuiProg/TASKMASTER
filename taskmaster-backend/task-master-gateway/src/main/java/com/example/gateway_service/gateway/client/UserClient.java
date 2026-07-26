package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "backend-core-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
public interface UserClient {
    @GetMapping("/getUserById/{id}")
    ApiResponseModel<UserDTO> getUserById (@PathVariable String id);

    @GetMapping(value = "/getAuthUser", produces = "application/json")
    ApiResponseModel<UserDTO> getAuthUser();
}
