package com.example.scheduler_service.scheduler.client;

import com.example.scheduler_service.scheduler.config.FeignCookieConfig;
import com.example.scheduler_service.scheduler.dto.ApiResponseModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

//@FeignClient(name = "backend-user-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-user-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface UserClient {

    @PostMapping("/emailUsers")
    ResponseEntity<ApiResponseModel<String>> emailUsers();
}
