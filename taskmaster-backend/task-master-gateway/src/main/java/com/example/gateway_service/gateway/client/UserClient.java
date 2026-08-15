package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@FeignClient(name = "backend-core-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-core-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface UserClient {
    @GetMapping("/getUserById/{id}")
    ResponseEntity<ApiResponseModel<UserDTO>> getUserById(@PathVariable String id);

    @GetMapping(value = "/getAuthUser", produces = "application/json")
    ResponseEntity<ApiResponseModel<UserDTO>> getAuthUser();

    @PostMapping(value = "/login", produces = "application/json")
    ResponseEntity<ApiResponseModel<UserDTO>> login(@RequestBody UserRequest userRequest);

    @PostMapping(value = "/logout", produces = "application/json")
    ResponseEntity<ApiResponseModel<UserDTO>> logout ();

    @PostMapping("/addUser")
    ResponseEntity<ApiResponseModel<UserDTO>> registerUser (@RequestBody UserRequest userRequest);

    @PostMapping("/resetPassword/{code}")
    ResponseEntity<ApiResponseModel<UserDTO>> resetPassword (@RequestBody UserRequest userRequest, @PathVariable String code);

    @PostMapping("/confirmResetPasswordCode/{code}")
    ResponseEntity<ApiResponseModel<String>> confirmResetPasswordCode (@RequestBody UserRequest userRequest, @PathVariable String code);

    @PutMapping("/updateUser/{id}")
    ResponseEntity<ApiResponseModel<UserDTO>> updateUser(@RequestBody UserRequest userRequest, @PathVariable String id);
}