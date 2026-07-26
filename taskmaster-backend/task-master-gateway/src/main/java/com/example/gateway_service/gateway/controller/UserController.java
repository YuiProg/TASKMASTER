package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.UserClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(("/api/v1"))
@AllArgsConstructor
public class UserController implements UserClient{

    private final UserClient userClient;

    @Override
    @GetMapping("/getUserById/{id}")
    public ApiResponseModel<UserDTO> getUserById (@PathVariable String id) {
        return userClient.getUserById(id);
    }

    @Override
    @GetMapping("/getAuthUser")
    public ApiResponseModel<UserDTO> getAuthUser() {
        return userClient.getAuthUser();
    }

}
