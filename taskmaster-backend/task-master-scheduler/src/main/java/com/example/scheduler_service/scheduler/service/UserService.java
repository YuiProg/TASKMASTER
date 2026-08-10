package com.example.scheduler_service.scheduler.service;

import com.example.scheduler_service.scheduler.client.UserClient;
import com.example.scheduler_service.scheduler.dto.ApiResponseModel;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class UserService implements UserClient {

    private final UserClient userClient;

    @Override
    @Scheduled(cron = "0 * 8 * * ?", zone = "Asia/Manila")
    //@Scheduled(fixedRate = 60000)
    public ResponseEntity<ApiResponseModel<String>> emailUsers() {
        try {
            log.info("SENDING EMAIL TO USERS");
            ResponseEntity<ApiResponseModel<String>> response = userClient.emailUsers();
            log.info("emailUsers RESPONSE status: {} data: {}", response.getStatusCode(), response.getBody());
            ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());
            return builder.body(response.getBody());
        } catch (FeignException e) {
            log.info("FeignException in UserService emailUsers() status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponseModel.error("USER SERVICE DOWN", "ERROR")
            );
        }
    }
}
