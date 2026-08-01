package com.example.scheduler_service.scheduler.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/scheduler")
public class PingController {

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> pingScheduler() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Scheduler service is active"
        ));
    }
}