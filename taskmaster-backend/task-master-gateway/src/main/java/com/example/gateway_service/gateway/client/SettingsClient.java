package com.example.gateway_service.gateway.client;

import com.example.gateway_service.gateway.config.FeignCookieConfig;
import com.example.gateway_service.gateway.dto.ApiResponseModel;
import com.example.gateway_service.gateway.dto.SettingsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

//@FeignClient(name = "backend-settings-client", url = "http://localhost:8080/api/v1/settings", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-settings-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface SettingsClient {

    @GetMapping("/getSettings")
    ResponseEntity<ApiResponseModel<SettingsDTO>> getSettings();

    @PutMapping("/setSettings")
    ResponseEntity<ApiResponseModel<SettingsDTO>> setSettings(@RequestBody SettingsDTO settingsDTO);
}
