package com.example.backend.service.SettingsService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Settings;
import com.example.backend.request.SettingsRequest;
import org.springframework.http.ResponseEntity;

public interface SettingsServiceInterface {
    ResponseEntity<ApiResponseModel<Settings>> getSettings ();
    ResponseEntity<ApiResponseModel<Settings>> setSettings (SettingsRequest settingsRequest);
}
