package com.example.backend.repository;

import com.example.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, String> {
    @Query("SELECT p FROM Project p WHERE p.projectName = :name")
    Project getProjectByName(String name);
}
