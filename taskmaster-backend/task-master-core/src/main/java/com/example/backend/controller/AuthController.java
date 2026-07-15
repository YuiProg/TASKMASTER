package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.service.UserProcessService.UserProcessService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import com.example.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.request.UserRequest;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class AuthController implements UserProcessService {

    private final UserProcessService userProcessService;


    @Override
    @PostMapping("/api/v1/addUser")
    public ResponseEntity<ApiResponseModel<User>> addUser(@RequestBody UserRequest userRequest) {
        return userProcessService.addUser(userRequest);
    }

    @Override
    @GetMapping("/api/v1/getUsers")
    public ResponseEntity<ApiResponseModel<List<User>>> getUsers() {
        return userProcessService.getUsers();
    }

    @Override
    @GetMapping("/api/v1/searchUsers")
    public ResponseEntity<ApiResponseModel<List<User>>> findUser(@RequestBody UserRequest userRequest) {
        return userProcessService.findUser(userRequest);
    }

    @Override
    @PostMapping("/api/v1/login")
    public ResponseEntity<ApiResponseModel<User>> loginUser(@RequestBody UserRequest userRequest, HttpServletRequest request) {
        return userProcessService.loginUser(userRequest, request);
    }

    @Override
    @PostMapping("/api/v1/logout")
    public ResponseEntity<ApiResponseModel<User>> logoutUser() {
        return userProcessService.logoutUser();
    }

    @Override
    @PutMapping("/api/v1/updateUser/{id}")
    public ResponseEntity<ApiResponseModel<Object>> updateUser(
            @PathVariable String id,
            @RequestBody UserRequest userRequest
    ) {
        return userProcessService.updateUser(id, userRequest);
    }

    @Override
    @DeleteMapping("/api/v1/deleteUser")
    public ResponseEntity<ApiResponseModel<User>> deleteUser(@RequestParam("id") String id) {
        return userProcessService.deleteUser(id);
    }

    @Override
    @GetMapping("/api/v1/getUserById/{id}")
    public ResponseEntity<ApiResponseModel<User>> getUserById(@PathVariable String id) {
        return userProcessService.getUserById(id);
    }

    @Override
    @GetMapping("/api/v1/getAuthUser")
    public ResponseEntity<ApiResponseModel<User>> getAuthUser() {
        return userProcessService.getAuthUser();
    }
}
