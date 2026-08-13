package com.example.backend.service.SettingsService;

import com.example.backend.model.Settings;
import com.example.backend.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsCacheService {

    private final SettingsRepository settingsRepository;
    private final CacheManager cacheManager;

    @Cacheable(value = "userSettings", key = "#a0")
    public Settings getSettingsFromCache (String userId) {
        Settings settings = settingsRepository.findUserSettings(userId);
        return settings;
    }



    @CacheEvict(value = "userSettings", key = "#a0")
    void evictSettingsInCache(String userId) {}
}
