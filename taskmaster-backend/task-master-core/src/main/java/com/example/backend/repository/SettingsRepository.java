package com.example.backend.repository;

import com.example.backend.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, String> {

    @Query("SELECT s FROM Settings s JOIN s.appliedTo a WHERE a.id = :id")
    Settings findUserSettings(String id);
}
