package com.example.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Try to grab the token out of the cookies
        String token = jwtUtil.extractTokenFromCookie(request);

        // 2. If a token exists and the user isn't authenticated yet
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtUtil.isTokenValid(token)) {
                String userId = jwtUtil.extractSubject(token);

                // 3. Authenticate the request (Using empty authorities list for simplicity right now)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userId, null, Collections.emptyList()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 4. Pass authentication to Spring Security Context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue processing the request filter chain
        filterChain.doFilter(request, response);
    }
}