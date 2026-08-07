package com.example.backend.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SettingsRequest {
    public String id;
    public String userId;
    public Boolean sendEmail;
    public Boolean locked;
}
