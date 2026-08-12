package com.example.gateway_service.gateway.controller;

import com.example.gateway_service.gateway.client.SettingsClient;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.SettingsDTO;
import com.example.gateway_service.gateway.service.SettingsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@AllArgsConstructor
public class SettingsController implements SettingsClient {

    private final SettingsService settingsService;

    @Override
    @GetMapping("/getSettings")
    public ResponseEntity<ApiResponseModel<SettingsDTO>> getSettings() {
        return settingsService.getSettings();
    }

    @Override
    @PutMapping("/setSettings")
    public ResponseEntity<ApiResponseModel<SettingsDTO>> setSettings(@RequestBody SettingsDTO settingsDTO) {
        return settingsService.setSettings(settingsDTO);
    }
}
