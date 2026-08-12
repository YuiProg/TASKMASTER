package com.example.backend.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SettingsRequest {
    public String id;
    public String userId;
    public Boolean sendEmailUponProjectCreation;
    public Boolean sendEmailUponTaskCreation;
    public Boolean sendEmailUponTaskUpdate;
    public Boolean sendDailyEmailTaskUpdates;
    public Boolean sendEmailUponLogin;
    public Boolean sendEmailDaily;
    public Boolean locked;
}
