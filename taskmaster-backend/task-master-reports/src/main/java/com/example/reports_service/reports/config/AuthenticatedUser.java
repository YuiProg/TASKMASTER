package com.example.reports_service.reports.config;


import com.example.reports_service.reports.client.UserClient;
import com.example.reports_service.reports.dto.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@AllArgsConstructor
public class AuthenticatedUser {
    private final UserClient userClient;
    private final JwtUtil jwtUtil;

    public UserDTO getAuthenticatedUser () {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return null;
        }
        HttpServletRequest request = attributes.getRequest();
        String token = jwtUtil.extractTokenFromCookie(request);
        String payload = jwtUtil.extractSubject(token);

        var user = userClient.getUserById(payload);
        return user.getData();
    }
}
