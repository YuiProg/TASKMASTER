package com.example.backend.service.SettingsService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Settings;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SettingsService implements SettingsServiceInterface{


    @Override
    public ResponseEntity<ApiResponseModel<Settings>> getSettings(String id) {
        return null;
    }
}
