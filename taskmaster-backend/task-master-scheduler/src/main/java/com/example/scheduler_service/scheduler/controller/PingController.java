package com.example.scheduler_service.scheduler.controller;

import com.example.scheduler_service.scheduler.dto.ApiResponseModel;
import com.example.scheduler_service.scheduler.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@NoArgsConstructor
public class PingController {

    @GetMapping("api/v1/scheduler")
    public ResponseEntity<ApiResponseModel<UserDTO>> pingScheduler () {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("PINGED SCHEDULER", "SUCCESS", null));
    }
}
