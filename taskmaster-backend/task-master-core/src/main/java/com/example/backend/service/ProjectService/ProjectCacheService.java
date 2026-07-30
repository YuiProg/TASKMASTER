package com.example.backend.service.ProjectService;

import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectCacheService {
    private final ProjectRepository projectRepository;

    @Cacheable(value = "projectByName", key = "#name")
    public Project getProjectInCache(String name) {
        Project project = projectRepository.getProjectByName(name);

        if (project != null && project.getMembers() != null) {
            project.setMembers(new ArrayList<>(project.getMembers()));
        }

        return project;
    }

    @Cacheable(value = "userAssignedProjects", key = "#id")
    public List<Project> getProjectsCache(String id) {
        List<Project> projects = projectRepository.checkIfUserIsInAProject(id);

        for (Project project : projects) {
            if (project != null && project.getMembers() != null) {
                project.setMembers(new ArrayList<>(project.getMembers()));
            }
        }

        return projects;
    }

    @Cacheable(value = "userCreatedProjects", key = "#userId")
    public List<Project> getUserCreatedProjectsInCache(String userId) {
        List<Project> projects = projectRepository.getUserCreatedProjects(userId);

        for (Project project : projects) {
            if (project != null && project.getMembers() != null) {
                project.setMembers(new ArrayList<>(project.getMembers()));
            }
        }

        return projects;
    }

    @CacheEvict(value = "userCreatedProjects", key = "#userId")
    public void evictUserCreatedProjects (String userId) {}
}