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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class UserService implements UserClient {

    private final UserClient userClient;
    private final JwtUtil jwtUtil;

    @Override
    public ResponseEntity<ApiResponseModel<UserDTO>> getUserById(String id) {
        try {
            log.info("REQUEST getUserById -> id: {}", id);
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.getUserById(id);
            log.info("RESPONSE getUserById -> status: {}, data: {}", response.getStatusCode(), response.getBody());

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE GET USER BY ID (error) -> status: {}, cause: {}", e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            HttpStatus status = (e.status() > 0)
                    ? HttpStatus.valueOf(e.status())
                    : HttpStatus.SERVICE_UNAVAILABLE;

            return ResponseEntity.status(status)
                    .body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "SERVER ERROR", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<UserDTO>> getAuthUser() {
        try {
            log.info("REQUEST getAuthUser");
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.getAuthUser();
            log.info("RESPONSE getAuthUser -> status: {}, data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE login (error) -> status: {}, cause: {}", e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
            HttpStatus status = e.status() > 0 ? HttpStatus.valueOf(e.status()) : HttpStatus.SERVICE_UNAVAILABLE;
            return ResponseEntity.status(status).body(ApiResponseModel.error(e.status() > 0 ? e.contentUTF8() : "SERVICE UNAVAILABLE", "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<UserDTO>> login(UserRequest userRequest) {
        log.info("REQUEST login -> email: {}", userRequest.getEmail());
        try {
            // 1. Core executes its code, sets the JWT cookie, and returns 200 OK
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.login(userRequest);
            log.info("RESPONSE login -> httpStatus: {}", response.getStatusCode());

            // 2. Gateway extracts Core's Set-Cookie header (containing the JWT token)
            List<String> cookies = response.getHeaders().get(HttpHeaders.SET_COOKIE);

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            // 3. Gateway attaches Core's cookie to its own clean response
            if (cookies != null && !cookies.isEmpty()) {
                for (String cookie : cookies) {
                    builder.header(HttpHeaders.SET_COOKIE, cookie);
                }
            }

            // 4. Returns body + Core's Set-Cookie header, leaving behind duplicate transport headers
            return builder.body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE login (error) -> status: {}, cause: {}", e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

            HttpStatus status = (e.status() > 0)
                    ? HttpStatus.valueOf(e.status())
                    : HttpStatus.SERVICE_UNAVAILABLE;

            ResponseCookie responseCookie = jwtUtil.deleteCookie();
            return ResponseEntity.status(status)
                    .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                    .body(ApiResponseModel.error(
                            e.status() > 0 ? e.contentUTF8() : "Backend service unavailable, please try again",
                            "ERROR"));
        }
    }
}