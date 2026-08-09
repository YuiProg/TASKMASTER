package com.example.gateway_service.gateway.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    public String id;
    public String username;
    public String email;
    public String password;
    public Set<String> roles;
    public String branchId;
    public Integer del;
    public String selectedBranch;
    public Boolean isReset;
}
