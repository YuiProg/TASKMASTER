package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.UserClient;
import com.example.gateway_service.gateway.config.JwtUtil;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class UserService implements UserClient {

    private final UserClient userClient;
    private final JwtUtil jwtUtil;

    @Override
    public ApiResponseModel<UserDTO> getUserById(String id) {
        log.info("REQUEST getUserById -> id: {}", id);
        ApiResponseModel<UserDTO> response = userClient.getUserById(id);
        log.info("RESPONSE getUserById -> status: {}, data: {}", response.getStatus(), response.getData());
        return response;
    }

    @Override
    public ApiResponseModel<UserDTO> getAuthUser() {
        return userClient.getAuthUser();
    }

    @Override
    public ResponseEntity<ApiResponseModel<UserDTO>> login(UserRequest userRequest) {
        log.info("REQUEST login -> email: {}", userRequest.getEmail());
        try {
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.login(userRequest);
            log.info("RESPONSE login -> httpStatus: {}, body: {}",
                    response.getStatusCode(), response.getBody());
            return response;
        } catch (FeignException e) {
            log.warn("RESPONSE login (error) -> status: {}, body: {}", e.status(), e.contentUTF8());
            ResponseCookie responseCookie = jwtUtil.deleteCookie();
            return ResponseEntity.status(e.status())
                    .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                    .body(ApiResponseModel.error(e.contentUTF8(), "ERROR"));
        }
    }
}