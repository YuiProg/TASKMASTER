package com.example.backend.service.UserProcessService;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCacheService {
    private final UserRepository userRepository;

    @Cacheable(value = "userData", key = "#id")
    public User getUserInCache (String id) {

        return userRepository.findById(id)
                .orElse(null);
    }

    @CacheEvict(value = "userData")
    public void evictUserCache () {}
}
