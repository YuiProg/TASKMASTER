package com.example.gateway_service.gateway.service;

import com.example.gateway_service.gateway.client.UserClient;
import com.example.gateway_service.gateway.config.JwtUtil;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.UserDTO;
import com.example.gateway_service.gateway.request.UserRequest;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Service
@AllArgsConstructor
public class UserService implements UserClient{

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

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseModel.error("CURRENTLY LOGGED OUT", "ERROR"));
        }

        HttpServletRequest request = attributes.getRequest();

        String token = jwtUtil.extractTokenFromCookie(request);
        String id = jwtUtil.extractSubject(token);

        try {

            log.info("REQUEST getAuthUser ID: {}", id);
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.getUserById(id);
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

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();

            String existingToken = jwtUtil.extractTokenFromCookie(request);
            if (existingToken != null) {
                ResponseCookie deleteCookie = jwtUtil.deleteCookie();
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                        .body(ApiResponseModel.error("Multiple sessions detected", "ERROR"));
            }
        }

        try {
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.login(userRequest);
            log.info("RESPONSE login -> httpStatus: {}", response.getStatusCode());

            ApiResponseModel<UserDTO> body = response.getBody();
            if (body == null || body.getData() == null) {
                return ResponseEntity.status(response.getStatusCode()).body(body);
            }

            String token = jwtUtil.generateToken(body.getData().getId());
            ResponseCookie cookie = jwtUtil.createCookie(token);

            return ResponseEntity.status(response.getStatusCode())
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(body);

        } catch (FeignException e) {
            log.error("RESPONSE login (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

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

    @Override
    public ResponseEntity<ApiResponseModel<UserDTO>> logout() {
        try {
            log.info("USER LOGGED OUT");
            ResponseCookie cookie = jwtUtil.deleteCookie();
            return ResponseEntity.status(HttpStatus.OK)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(ApiResponseModel.success("USER LOGGED OUT", "SUCCESS", null));
        } catch (FeignException e) {
            log.error("RESPONSE login (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

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

    @Override
    public ResponseEntity<ApiResponseModel<UserDTO>> registerUser(UserRequest userRequest) {
        log.info("REQUEST register -> email: {} password: {}", userRequest.getEmail(), userRequest.getPassword());

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();

            String existingToken = jwtUtil.extractTokenFromCookie(request);
            if (existingToken != null) {
                ResponseCookie deleteCookie = jwtUtil.deleteCookie();
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                        .body(ApiResponseModel.error("You are currently logged in. Please try again", "ERROR"));
            }
        }
        try {
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.registerUser(userRequest);
            log.info("register RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());

            return builder.body(response.getBody());

        } catch (FeignException e) {
            log.error("RESPONSE register (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

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

    @Override
    public ResponseEntity<ApiResponseModel<UserDTO>> resetPassword(UserRequest userRequest, String code) {
        try {
            log.info("resetPassword REQUEST email: {}", userRequest.getEmail());
            ResponseEntity<ApiResponseModel<UserDTO>> response = userClient.resetPassword(userRequest, code);
            log.info("resetPassword RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());
            return builder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE resetPassword (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

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

    @Override
    public ResponseEntity<ApiResponseModel<String>> confirmResetPasswordCode(UserRequest userRequest, String code) {
        try {
            log.info("confirmResetPasswordCode REQUEST email: {}", userRequest.getEmail());
            ResponseEntity<ApiResponseModel<String>> response = userClient.confirmResetPasswordCode(userRequest, code);
            log.info("confirmResetPasswordCode RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());
            return builder.body(response.getBody());
        } catch (FeignException e) {
            log.error("RESPONSE confirmResetPasswordCode (error) -> status: {}, cause: {}",
                    e.status(), e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);

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