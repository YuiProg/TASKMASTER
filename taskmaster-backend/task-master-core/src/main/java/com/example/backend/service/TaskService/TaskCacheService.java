package com.example.backend.service.TaskService;

import com.example.backend.model.Task;
import com.example.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskCacheService {

    private final TaskRepository taskRepository;

    @Cacheable(value = "taskData", key = "#id")
    public Task getTaskByIdCached(String id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return null;

        // Strip PersistentBag wrappers before storing in Redis
        if (task.getProject() != null && task.getProject().getMembers() != null) {
            task.getProject().setMembers(new ArrayList<>(task.getProject().getMembers()));
        }

        return task;
    }

    @CacheEvict(value = "taskData", key = "#taskId")
    public void evictTaskCache(String taskId) {
        // This method clears the cached entry from Redis when updated
    }

    @CacheEvict(value = "taskData", allEntries = true)
    public void evictTaskEntriesCache () {}

    @Cacheable(value = "taskData", key = "#projectId")
    public List<Task> getProjectTaskCached (String projectId) {
        List<Task> tasks = taskRepository.getTaskOnProject(projectId);
        if (tasks == null) return null;

        for (Task task : tasks) {
            if (task.getProject() != null && task.getProject().getMembers() != null) {
                task.getProject().setMembers(new ArrayList<>(task.getProject().getMembers()));
            }
        }

        return tasks;
    }

    @Cacheable(value = "taskData", key = "#userId")
    public List<Task> getAuthenticatedUserTaskCached (String userId) {
        List<Task> tasks = taskRepository.findAuthenticatedTaskByAssignee(userId);

        for (Task task : tasks) {
            if (task.getProject() != null && task.getProject().getMembers() != null) {
                task.getProject().setMembers(new ArrayList<>(task.getProject().getMembers()));
            }
        }

        return tasks;
    }

    @Cacheable(value = "taskData")
    public List<Task> getAllOpenTaskCache () {
        List<Task> tasks = taskRepository.getAllOpenTask();

        for (Task task : tasks) {
            if (task.getProject() != null && task.getProject().getMembers() != null) {
                task.getProject().setMembers(new ArrayList<>(task.getProject().getMembers()));
            }
        }

        return tasks;
    }

    @Cacheable(value = "taskArchive")
    public List<Task> getArchiveTasksCache () {
        List<Task> tasks = taskRepository.getArchived();

        for (Task task : tasks) {
            if (task.getProject() != null && task.getProject().getMembers() != null) {
                task.getProject().setMembers(new ArrayList<>(task.getProject().getMembers()));
            }
        }

        return tasks;
    }

    @CacheEvict(value = "taskArchive", allEntries = true)
    void evictArchiveTask () {}


}