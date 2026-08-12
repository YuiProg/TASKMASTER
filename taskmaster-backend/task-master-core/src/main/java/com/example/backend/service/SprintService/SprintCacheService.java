package com.example.backend.service.SprintService;

import com.example.backend.model.Project;
import com.example.backend.model.Sprint;
import com.example.backend.model.Task;
import com.example.backend.model.User;
import com.example.backend.repository.SprintRepository;
import com.example.backend.service.UserProcessService.UserCacheService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SprintCacheService {
    private final SprintRepository sprintRepository;
    private final UserCacheService userCacheService;

    @Cacheable(value = "getUserSprint", key = "#a0")
    public List<Sprint> getSprints(String userId) {
        List<Sprint> sprints = sprintRepository.getSprints(userId);

        for (Sprint sprint : sprints) {
            if (sprint != null && sprint.getSprintMembers() != null
                && sprint.getSprintTasks() != null) {
                sprint.setSprintTasks(new ArrayList<>(sprint.getSprintTasks()));
                List<User> members = new ArrayList<>();
                for (User user : sprint.getSprintMembers()) {
                    User member = userCacheService.getUserInCache(user.getId());
                    members.add(member);
                }
                sprint.setSprintMembers(members);
            }
            if (sprint != null && sprint.getProjectId() != null) {
                if (sprint.getProjectId().getMembers() != null) {
                    assert sprint.getSprintMembers() != null;
                    sprint.getProjectId()
                            .setMembers(new ArrayList<>(sprint.getSprintMembers()));
                }
            }
        }

        return sprints;
    }

    @Cacheable(value = "getUserSprint", key = "#id")
    public Sprint viewSprintCache (String id) {
        Sprint sprint = sprintRepository.findById(id).orElse(null);
        if (sprint != null && sprint.getSprintMembers() != null
                && sprint.getSprintTasks() != null) {
            List<User> users = new ArrayList<>();
            for (User members : sprint.getSprintMembers()) {
                User user = userCacheService.getUserInCache(members.getId());
                users.add(user);
            }
            sprint.setSprintMembers(users);
            sprint.setSprintTasks(new ArrayList<>(sprint.getSprintTasks()));
            sprint.setSprintMembers(new ArrayList<>(sprint.getSprintMembers()));
        }
        if (sprint != null && sprint.getProjectId() != null) {
            if (sprint.getProjectId().getMembers() != null) {
                assert sprint.getSprintMembers() != null;
                sprint.getProjectId()
                        .setMembers(new ArrayList<>(sprint.getSprintMembers()));
            }
        }
        return sprint;
    }

    @CacheEvict(value = "getUserSprint", allEntries = true)
    public void evictSprintCache () {}
}