package com.example.gateway_service.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingsDTO {
    private String id;
    private UserDTO appliedTo;
    private Boolean sendEmailUponProjectCreation;
    private Boolean sendEmailUponTaskCreation;
    private Boolean sendEmailUponLogin;
    private Boolean sendEmailUponTaskUpdate;
    private Boolean sendDailyEmailTaskUpdates;
    private Boolean locked;
}
