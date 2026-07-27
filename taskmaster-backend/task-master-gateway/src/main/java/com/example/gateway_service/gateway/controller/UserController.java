package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.UserClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import com.example.gateway_service.gateway.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class UserController implements UserClient{

    private final UserService userService;

    @Override
    @GetMapping("/getUserById/{id}")
    public ApiResponseModel<UserDTO> getUserById (@PathVariable String id) {
        return userService.getUserById(id);
    }

    @Override
    @GetMapping("/getAuthUser")
    public ApiResponseModel<UserDTO> getAuthUser() {
        return userService.getAuthUser();
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<ApiResponseModel<UserDTO>> login(@RequestBody UserRequest userRequest) {
        return userService.login(userRequest);
    }

}
