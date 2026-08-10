package com.example.backend.service.UserProcessService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import com.example.backend.request.UserRequest;

import java.util.List;

public interface UserProcessService {
    ResponseEntity<ApiResponseModel<User>> addUser (UserRequest userRequest);

    ResponseEntity<ApiResponseModel<List<User>>> getUsers ();

    ResponseEntity<ApiResponseModel<List<User>>> findUser (UserRequest userRequest);

    ResponseEntity<ApiResponseModel<User>> loginUser (UserRequest userRequest);

    ResponseEntity<ApiResponseModel<User>> logoutUser ();

    ResponseEntity<ApiResponseModel<Object>> updateUser (String id, UserRequest userRequest);

    ResponseEntity<ApiResponseModel<User>> deleteUser (String id);

    ResponseEntity<ApiResponseModel<User>> getUserById(String id);

    ResponseEntity<ApiResponseModel<User>> getAuthUser ();

    ResponseEntity<ApiResponseModel<User>> resetPassword (UserRequest userRequest, String code);

    ResponseEntity<ApiResponseModel<String>> confirmResetPasswordCode (UserRequest userRequest, String code);

    ResponseEntity<ApiResponseModel<String>> emailUsers();
}
