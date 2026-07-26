package com.example.gateway_service.gateway.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignCookieConfig {

    @Bean
    public RequestInterceptor forwardCookieInterceptor() {
        return template -> {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();

                // Read cookies from the incoming browser/frontend request
                if (request.getCookies() != null) {
                    StringBuilder cookieHeader = new StringBuilder();
                    for (Cookie cookie : request.getCookies()) {
                        if (cookieHeader.length() > 0) {
                            cookieHeader.append("; ");
                        }
                        cookieHeader.append(cookie.getName()).append("=").append(cookie.getValue());
                    }
                    // Inject them into the outgoing Feign request to the Reports Service
                    template.header("Cookie", cookieHeader.toString());
                }
            }
        };
    }
}