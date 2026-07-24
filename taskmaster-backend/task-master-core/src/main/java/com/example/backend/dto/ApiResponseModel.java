package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseModel<T> {
    private String message;
    private String status;
    private T data;
    private T oldData;

    public static <T> ApiResponseModel <T> success (String message, String status, T data) {
        return new ApiResponseModel<>(message, status, data, null);
    }

    public static <T> ApiResponseModel <T> error (String message, String status) {
        return new ApiResponseModel<>(message, status, null, null);
    }

    public static <T> ApiResponseModel <T> update (String message, String status, T data, T oldData) {
        return new ApiResponseModel<>(message, status, data, oldData);
    }
}
