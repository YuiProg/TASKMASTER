package com.example.backend.config;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@AllArgsConstructor
public class AuthenticatedUser {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public User getAuthenticatedUser () {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return null;
        }
        HttpServletRequest request = attributes.getRequest();
        String token = jwtUtil.extractTokenFromCookie(request);
        String payload = jwtUtil.extractSubject(token);
        return userRepository.findById(payload).orElse(null);
    }
}
