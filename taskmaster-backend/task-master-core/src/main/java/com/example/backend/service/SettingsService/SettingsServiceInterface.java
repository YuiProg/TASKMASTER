package com.example.backend.service.SettingsService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Settings;
import org.springframework.http.ResponseEntity;

public interface SettingsServiceInterface {
    ResponseEntity<ApiResponseModel<Settings>> getSettings (String id);
}
