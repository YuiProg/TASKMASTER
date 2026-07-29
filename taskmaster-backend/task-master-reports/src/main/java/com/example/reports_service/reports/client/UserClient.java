package com.example.reports_service.reports.client;


import com.example.reports_service.reports.dto.ApiResponseModel;
import com.example.reports_service.reports.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//@FeignClient(name = "backend-core-client", url = "${services.backend.url}")
@FeignClient(name = "backend-user-client", url = "http://localhost:8080/api/v1")
public interface UserClient {
    @GetMapping("/getUserById/{id}")
    ApiResponseModel<UserDTO> getUserById (@PathVariable String id);

    @GetMapping("/getAuthUser")
    ApiResponseModel<UserDTO> getAuthUser();
}
