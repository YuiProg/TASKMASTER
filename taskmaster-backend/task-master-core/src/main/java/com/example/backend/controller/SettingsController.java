package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Settings;
import com.example.backend.service.SettingsService.SettingsServiceInterface;
import org.springframework.http.ResponseEntity;

public class SettingsController implements SettingsServiceInterface {

    @Override
    public ResponseEntity<ApiResponseModel<Settings>> getSettings(String id) {
        return null;
    }
}
