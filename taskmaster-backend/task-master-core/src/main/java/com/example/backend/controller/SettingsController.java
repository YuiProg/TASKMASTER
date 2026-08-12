package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Settings;
import com.example.backend.request.SettingsRequest;
import com.example.backend.service.SettingsService.SettingsService;
import com.example.backend.service.SettingsService.SettingsServiceInterface;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@AllArgsConstructor
public class SettingsController implements SettingsServiceInterface {

    private final SettingsService settingsService;

    @Override
    @GetMapping("/getSettings")
    public ResponseEntity<ApiResponseModel<Settings>> getSettings() {
        return settingsService.getSettings();
    }

    @Override
    @PutMapping("/setSettings")
    public ResponseEntity<ApiResponseModel<Settings>> setSettings(@RequestBody SettingsRequest settingsRequest) {
        return settingsService.setSettings(settingsRequest);
    }
}
