package com.example.backend.service.ProjectService;

import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectCacheService {
    private final ProjectRepository projectRepository;

    @Cacheable(value = "projectData", key = "#name")
    public Project getProjectInCache (String name) {
        Project project = projectRepository.getProjectByName(name);

        if (project != null && project.getMembers() != null) {

            project.setMembers(new ArrayList<>(project.getMembers()));
        }

        return project;
    }

    @Cacheable(value = "projectData")
    public List<Project> getProjectsCache (String id) {
        List<Project> projects = projectRepository.checkIfUserIsInAProject(id);

        for (Project project : projects) {
            if (project != null && project.getMembers() != null) {
                project.setMembers(new ArrayList<>(project.getMembers()));
            }
        }

        return projects;
    }
}
