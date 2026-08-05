package com.example.backend.repository;

import com.example.backend.model.Project;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, String> {
    @Query("SELECT p FROM Project p WHERE p.projectName = :name AND p.del = 0")
    Project getProjectByName(String name);

    @Query("SELECT p FROM Project p WHERE :userId NOT IN " +
            "(SELECT m.id FROM p.members m) ORDER BY p.createdAt DESC")
    List<Project> getAllProjects(@Param("userId") String userId);

    @Query("SELECT p FROM Project p WHERE :userId IN " +
            "(SELECT m.id FROM p.members m) AND p.archived = 0 ORDER BY p.createdAt DESC")
    List<Project> checkIfUserIsInAProject (@Param("userId")String userId);

    @Query("SELECT p FROM Project p WHERE p.createdBy.id = :userId AND p.archived = 0 ORDER BY p.createdAt DESC")
    List<Project> getUserCreatedProjects (String userId);

    @Query("SELECT p FROM Project p WHERE p.archived = 1 AND p.del = 0 ORDER BY p.createdAt DESC")
    List<Project> getArchivedProjects ();
}
