package com.example.backend.service.SprintService;

import com.example.backend.config.AuthenticatedUser;
import com.example.backend.constants.StringCodes;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Project;
import com.example.backend.model.Sprint;
import com.example.backend.model.Task;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.SprintRepository;
import com.example.backend.request.SprintRequest;
import com.example.backend.service.EmailService.EmailService;
import com.example.backend.service.ProjectService.ProjectCacheService;
import com.example.backend.service.TaskService.TaskCacheService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class SprintServiceImpl implements SprintServiceInterface {

    private final SprintRepository sprintRepository;
    private final ProjectCacheService projectCacheService;
    private final AuthenticatedUser authenticatedUser;
    private final TaskCacheService taskCacheService;
    private final ProjectRepository projectRepository;
    private final EmailService emailService;
    private final SprintCacheService sprintCacheService;

    @Override
    public ResponseEntity<ApiResponseModel<Sprint>> createSprint(SprintRequest sprintRequest) {
        Project project = projectCacheService.getProjectInCacheById(sprintRequest.getProjectId());
        User user = authenticatedUser.getAuthenticatedUser();
        List<Task> tasksInProject = taskCacheService.getProjectTaskCached(project.getId());
        Sprint sprint;
        String id = project.getId();

        if (!Objects.equals(project.getCreatedBy().getId(), user.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseModel.error("YOU ARE NOT THE OWNER OF THIS PROJECT", "ERROR"));
        }

        if (project.getMembers().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseModel.error("THERE ARE NO MEMBERS IN THIS PROJECT", "ERROR"));
        }

        if (StringCodes.TRUE.getCode().equals(project.getInSprint())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseModel.error("PROJECT IS ALREADY IN SPRINT", "ERROR"));
        }

        if (sprintRequest.getDeadline() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseModel.error("PLEASE PROVIDE A DEADLINE.", "ERROR"));
        }

        sprint = new Sprint();
        sprint.setSprintName(sprintRequest.getSprintName());
        sprint.setSprintMembers(project.getMembers());
        sprint.setCreatedAt(new Date().getTime());
        sprint.setInitiatedBy(user);
        sprint.setProjectId(project);
        sprint.setUpdatedBy(user.getUsername());

        List<String> taskIds = sprintRequest.getTaskIds();
        List<Task> tasks = new ArrayList<>();

        for (String ids : taskIds) {
            try {
                Task task = taskCacheService.getTaskByIdCached(ids);
                boolean taskInProject = tasksInProject.stream()
                        .anyMatch(t -> Objects.equals(t.getId(), task.getId()));

                if (taskInProject) {
                    tasks.add(task);
                } else {
                    throw new RuntimeException(task.getTaskName().toUpperCase() + " IS NOT PART OF PROJECT");
                }
            } catch (IllegalArgumentException e) {
                log.info("FAILED TO CREATE SPRINT message: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponseModel.error("FAILED TO CREATE SPRINT", "ERROR"));
            } catch (RuntimeException e) {
                log.info("FAILED TO INITIATE SPRINT message: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponseModel.error(e.getMessage(), "ERROR"));
            }
        }
        sprint.setSprintTasks(tasks);

        if (sprintRequest.getDeadline() != null) {
            sprint.setDeadline(sprintRequest.getDeadline());
        }
        sprintCacheService.evictSprintCache();
        Sprint newSprint = sprintRepository.save(sprint);

        for (User member : project.getMembers()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                    .withZone(ZoneId.of("UTC"));
            emailService.sendTemplatedEmail(
                    member.getEmail(),
                    "SPRINT_CREATED_EMAIL",
                    Map.of(
                            "sprintName", newSprint.getSprintName(),
                            "memberName", member.getUsername(),
                            "projectName", project.getProjectName(),
                            "initiatedBy", newSprint.getInitiatedBy().getUsername(),
                            "deadline", formatter.format(Instant.ofEpochMilli(newSprint.getDeadline())),
                            "sprintUrl", "https://taskmasteropnexus.xyz/sprint/view/" + newSprint.getId()
                    )
            );
        }

        projectRepository.projectIsInSprint(id, newSprint.getId());

        projectCacheService.evictUserViewProjectCache(project.getProjectName());
        projectCacheService.evictProjectInCacheById(id);
        projectCacheService.evictUserProjectsCache();
        projectCacheService.evictUserCreatedProjects(user.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseModel.success("SPRINT CREATED", "SUCCESS", newSprint));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Sprint>>> getSprints() {
        User user = authenticatedUser.getAuthenticatedUser();
        List<Sprint> sprints = sprintCacheService.getSprints(user.getId());

        for (Sprint sprint : sprints) {
            if (sprint.getDeadline() != null && sprint.getDeadline() == new Date().getTime()) {
                sprintRepository.finishSprint(sprint.getId());
            }
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("SPRINTS FOUND", "SUCCESS", sprints));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Sprint>> getSprintById(String id) {
        Sprint sprint = sprintCacheService.viewSprintCache(id);
        return ResponseEntity.ok(ApiResponseModel.success("SPRINT FOUND", "SUCCESS", sprint));
    }
}