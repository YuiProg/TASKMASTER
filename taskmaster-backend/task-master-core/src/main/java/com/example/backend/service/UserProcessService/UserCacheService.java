package com.example.backend.service.UserProcessService;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCacheService {
    private final UserRepository userRepository;
    private final CacheManager cacheManager;

    @Cacheable(value = "userData", key = "#id")
    public User getUserInCache (String id) {

        return userRepository.findById(id)
                .orElse(null);
    }

    @Cacheable(value = "userData", key = "#email")
    public User getUserInCacheByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElse(null);
    }

    public void saveCode (String key, String code) {
        Cache cache = cacheManager.getCache("code");

        if (cache != null) {
            cache.put(key, code);
        }
    }

    public String getCode (String key) {
        Cache cache = cacheManager.getCache("code");
        if (cache != null) {
            return cache.get(key, String.class);
        }

        return null;
    }

    public void evictResetCode (String key) {
        Cache cache = cacheManager.getCache("code");
        if (cache != null) {
            cache.evict(key);
        }
    }

    @CacheEvict(value = "userData")
    public void evictUserCache () {}
}
