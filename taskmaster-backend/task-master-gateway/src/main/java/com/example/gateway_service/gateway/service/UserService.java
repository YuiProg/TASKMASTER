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
            log.info("RESPONSE login -> httpStatus: {}", response.getStatusCode());

            // Extract Set-Cookie headers specifically, discarding internal transport headers (Content-Length, Transfer-Encoding)
            List<String> cookies = response.getHeaders().get(HttpHeaders.SET_COOKIE);

            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            if (cookies != null && !cookies.isEmpty()) {
                for (String cookie : cookies) {
                    builder.header(HttpHeaders.SET_COOKIE, cookie);
                }
            }

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