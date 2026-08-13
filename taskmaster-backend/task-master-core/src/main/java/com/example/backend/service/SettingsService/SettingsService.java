package com.example.backend.service.SettingsService;

import com.example.backend.config.AuthenticatedUser;
import com.example.backend.constants.StringCodes;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Settings;
import com.example.backend.model.User;
import com.example.backend.repository.SettingsRepository;
import com.example.backend.request.SettingsRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SettingsService implements SettingsServiceInterface{

    private final SettingsRepository settingsRepository;
    private final SettingsCacheService settingsCacheService;
    private final AuthenticatedUser authenticatedUser;

    @Override
    public ResponseEntity<ApiResponseModel<Settings>> getSettings() {
        User user = authenticatedUser.getAuthenticatedUser();
        Settings settings = settingsCacheService.getSettingsFromCache(user.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("SETTINGS FOUND", "SUCCESS", settings));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Settings>> setSettings(SettingsRequest settingsRequest) {
        User user = authenticatedUser.getAuthenticatedUser();
        Settings settings = settingsCacheService.getSettingsFromCache(user.getId());

        if (settingsRequest.sendDailyEmailTaskUpdates != null) {
            settings.setSendDailyEmailTaskUpdates(settingsRequest.getSendDailyEmailTaskUpdates());
        }
        if (settingsRequest.sendEmailUponTaskCreation != null) {
            settings.setSendEmailUponTaskCreation(settingsRequest.getSendEmailUponTaskCreation());
        }
        if (settingsRequest.sendEmailUponLogin != null) {
            settings.setSendEmailUponLogin(settingsRequest.getSendEmailUponLogin());
        }
        if (settingsRequest.sendEmailUponProjectCreation != null) {
            settings.setSendEmailUponProjectCreation(settingsRequest.getSendEmailUponProjectCreation());
        }
        if (settingsRequest.getLocked() != null) {
            settings.setLocked(settingsRequest.getLocked());
        }
        if (settingsRequest.sendEmailUponTaskUpdate != null) {
            settings.setSendEmailUponTaskUpdate(settingsRequest.getSendEmailUponTaskUpdate());
        }

        if (settingsRequest.getLocked() != null && settingsRequest.getLocked().equals(StringCodes.TRUE.getFlag())) {
            //email muna dito bago mag lock
            settings.setLocked(StringCodes.TRUE.getFlag());
        }

        settingsCacheService.evictSettingsInCache(user.getId());
        Settings newSettings = settingsRepository.save(settings);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("SETTINGS UPDATED", "SUCCESS", newSettings));
    }
}
