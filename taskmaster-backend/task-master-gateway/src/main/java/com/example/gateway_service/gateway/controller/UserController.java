package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.UserClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import com.example.gateway_service.gateway.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class UserController implements UserClient{

    private final UserService userService;

    @Override
    @GetMapping("/getUserById/{id}")
    public ResponseEntity<ApiResponseModel<UserDTO>> getUserById (@PathVariable String id) {
        return userService.getUserById(id);
    }

    @Override
    @GetMapping("/getAuthUser")
    public ResponseEntity<ApiResponseModel<UserDTO>> getAuthUser() {
        return userService.getAuthUser();
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<ApiResponseModel<UserDTO>> login(@RequestBody UserRequest userRequest) {
        return userService.login(userRequest);
    }

    @Override
    @PostMapping("/logout")
    public ResponseEntity<ApiResponseModel<UserDTO>> logout() {
        return userService.logout();
    }

    @Override
    @PostMapping("/addUser")
    public ResponseEntity<ApiResponseModel<UserDTO>> registerUser(@RequestBody UserRequest userRequest) {
        return userService.registerUser(userRequest);
    }

    @Override
    @PostMapping("/resetPassword/{code}")
    public ResponseEntity<ApiResponseModel<UserDTO>> resetPassword(@RequestBody UserRequest userRequest, @PathVariable String code) {
        return userService.resetPassword(userRequest, code);
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> pingGateway () {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "gateway"
        ));
    }

}
