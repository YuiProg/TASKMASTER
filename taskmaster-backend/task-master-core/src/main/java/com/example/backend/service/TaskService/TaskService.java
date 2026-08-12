package com.example.backend.service.TaskService;

import com.example.backend.client.ReportClient;
import com.example.backend.config.AuthenticatedUser;
import com.example.backend.constants.StringCodes;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.dto.ReportDTO;
import com.example.backend.model.Project;
import com.example.backend.model.Settings;
import com.example.backend.model.Task;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.SettingsRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.TaskRequest;
import com.example.backend.service.EmailService.EmailService;
import com.example.backend.service.SprintService.SprintCacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TaskService implements TaskServiceInterface {

    private final TaskRepository taskRepository;
    private final AuthenticatedUser authenticatedUser;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ReportClient reportClient;
    private final EmailService emailService;
    private final SprintCacheService sprintCacheService;
    private final SettingsRepository settingsRepository;

    // Inject internal cache service
    private final TaskCacheService taskCacheService;

    @Override
    public ResponseEntity<ApiResponseModel<Task>> createTask(TaskRequest taskRequest) {
        Task task = new Task();

        User user = authenticatedUser.getAuthenticatedUser();
        task.setCreatedBy(user);
        task.setTaskName(taskRequest.getTaskName());

        task.setUpdatedBy(user.getUsername());
        task.setCreatedAt(new Date().getTime());
        task.setDescription(taskRequest.getDescription());

        if (taskRequest.getStatus() != null && !taskRequest.getStatus().trim().isEmpty()) {
            task.setStatus(taskRequest.getStatus());
        }

        Project project = projectRepository.getProjectByName(taskRequest.getProject());

        if (project == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error("PROJECT NOT FOUND", "ERROR"));
        }

        if (taskRequest.getAssignee() != null && !taskRequest.getAssignee().trim().isEmpty()) {
            List<User> members = project.getMembers();
            User assignee = userRepository.findByEmail(taskRequest.getAssignee()).orElse(null);

            if (assignee == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
            }

            for (User users : members) {
                boolean isMember = project.getMembers().stream()
                        .anyMatch(member -> Objects.equals(member.getId(), assignee.getId()));

                if (!isMember) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(ApiResponseModel.error("User is not a member of this project.", "ERROR"));
                }

            }

            task.setAssignee(assignee);
        }

        if (taskRequest.getPriority() != null && !taskRequest.getPriority().trim().isEmpty()) {
            task.setPriority(taskRequest.getPriority());
        }
        Settings settings = settingsRepository.findUserSettings(user.getId());

        if (settings == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponseModel.error("SETTINGS NOT FOUND PLEASE RE-LOGIN", "ERROR")
            );
        }

        task.setProject(project);
        Task newTask = taskRepository.save(task);

        if (!taskRequest.getAssignee().isEmpty()) {
            Settings assigneeSettings = settingsRepository.findUserSettings(newTask.getAssignee().getId());
            if (assigneeSettings == null) {
                Settings setAssigneeSettings = new Settings();
                setAssigneeSettings.setAppliedTo(newTask.getAssignee());
                 assigneeSettings = settingsRepository.save(setAssigneeSettings);
            }
            if (assigneeSettings.getSendEmailUponTaskCreation().equals(StringCodes.TRUE.getFlag())) {
                emailService.sendTemplatedEmail(
                        newTask.getAssignee().getEmail(),
                        "NEW_TASK_ASSIGNMENT",
                        Map.of(
                                "assigneeName", newTask.getAssignee().getUsername(),
                                "taskTitle", newTask.getTaskName() != null ? newTask.getTaskName() : "Untitled Task",
                                "taskDescription", newTask.getDescription() != null ? newTask.getDescription() : "No description provided.",
                                "taskStatus", newTask.getStatus() != null ? newTask.getStatus() : "N/A",
                                "taskPriority", newTask.getPriority() != null ? newTask.getPriority() : "N/A",
                                "taskUrl", "https://taskmasteropnexus.xyz/tasks/view/" + newTask.getId()
                        )
                );
            }

        }
        taskCacheService.evictOpenTask();
        taskCacheService.evictTaskEntriesCache();


        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseModel.success("NEW TASK CREATED", "SUCCESS", newTask));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getAllTask(String status) {
        return null;
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getTasksByAssignee(Long userId) {
        return null;
    }

    @Override
    public ResponseEntity<ApiResponseModel<Task>> updateTask(String taskId, TaskRequest taskRequest) {
        String log = "";
        User authUser = authenticatedUser.getAuthenticatedUser();
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error("TASK NOT FOUND", "ERROR"));
        }

        Task oldTask = new Task();
        oldTask.setId(task.getId());
        oldTask.setTaskName(task.getTaskName());
        oldTask.setStatus(task.getStatus());
        oldTask.setProject(task.getProject());
        oldTask.setUpdatedBy(task.getUpdatedBy());
        oldTask.setDescription(task.getDescription());
        oldTask.setCreatedBy(task.getCreatedBy());
        oldTask.setCreatedAt(task.getCreatedAt());
        oldTask.setAssignee(task.getAssignee());

        String userId = authUser != null ? authUser.getId() : null;
        String assigneeId = task.getAssignee() != null ? task.getAssignee().getId() : null;
        String createdById = task.getCreatedBy() != null ? task.getCreatedBy().getId() : null;


        boolean isAssignee = Objects.equals(assigneeId, userId);
        boolean isCreator = Objects.equals(createdById, userId);

        boolean isMembers = task.getProject().getMembers()
                .stream().anyMatch(member -> Objects.equals(member.getEmail(), taskRequest.getAssignee()));

        if (!isAssignee && !isCreator && !isMembers) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseModel.error("You are not authorized to update this task.", "ERROR"));
        }

        if (taskRequest.getTaskName() != null && !taskRequest.getTaskName().trim().isEmpty()) {
            task.setTaskName(taskRequest.getTaskName());
        }

        task.setUpdatedBy(authUser.getUsername());

        if (taskRequest.getProject() != null && !taskRequest.getProject().trim().isEmpty()) {
            Project project = projectRepository.getProjectByName(taskRequest.getProject());
            task.setProject(project);
        }

        if (taskRequest.getDescription() != null && !taskRequest.getDescription().trim().isEmpty()) {
            task.setDescription(taskRequest.getDescription());
            log = "UPDATED DESCRIPTION";
        }

        if (taskRequest.getAssignee() != null && !taskRequest.getAssignee().trim().isEmpty()) {
            User assignee = userRepository.findByEmail(taskRequest.getAssignee()).orElse(null);

            if (assignee == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
            }

            if (task.getProject() != null) {
                List<User> members = task.getProject().getMembers();
                for (User users : members) {
                    boolean isMember = task.getProject().getMembers()
                            .stream().anyMatch(member -> Objects.equals(member.getId(), assignee.getId()));

                    if (!isMember) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponseModel.error("User is not a member of this project.", "ERROR"));
                    }
                }
            }
            task.setAssignee(assignee);
            log = String.format("UPDATED ASSIGNEE TO %s", assignee.getUsername());
        }

        if (taskRequest.getPriority() != null && !taskRequest.getPriority().trim().isEmpty()) {
            task.setPriority(taskRequest.getPriority());
            log = String.format("UPDATE PRIORITY TO %s", taskRequest.getPriority());
        }

        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setTaskId(task.getId());
        reportDTO.setDescription(log);
        reportDTO.setPerformedBy(authUser.getId());
        reportDTO.setCreatedAt(new Date().getTime());
        reportClient.postReport(reportDTO);
        Task newTask = taskRepository.save(task);

        taskCacheService.evictTaskEntriesCache();
        taskCacheService.evictOpenTask();
        sprintCacheService.evictSprintCache();

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.update("TASK UPDATED", "SUCCESS", newTask, oldTask));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getAuthenticatedUserTask() {
        User user = authenticatedUser.getAuthenticatedUser();
        String userId = user.getId();
        List<Task> tasks = taskCacheService.getAuthenticatedUserTaskCached(userId);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASKS FOUND", "SUCCESS", tasks));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Task>> updateTaskStatus(String taskId, TaskRequest taskRequest) {
        Task task = taskRepository.findById(taskId).orElse(null);

        User user = authenticatedUser.getAuthenticatedUser();
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("TASK NOT FOUND", "ERROR"));
        }

        boolean isMember = user != null && task.getProject().getMembers()
                .stream().anyMatch(member -> Objects.equals(member.getEmail(), user.getEmail()));


        String userId = user != null ? user.getId() : null;
        String assigneeId = task.getAssignee() != null ? task.getAssignee().getId() : null;
        String createdById = task.getCreatedBy() != null ? task.getCreatedBy().getId() : null;


        boolean isAssignee = Objects.equals(assigneeId, userId);
        boolean isCreator = Objects.equals(createdById, userId);

        if (!isAssignee && !isCreator && !isMember) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseModel.error("You are not authorized to update this task.", "ERROR"));
        }

        Task oldTask = new Task();
        oldTask.setId(task.getId());
        oldTask.setTaskName(task.getTaskName());
        oldTask.setStatus(task.getStatus());
        oldTask.setProject(task.getProject());
        oldTask.setUpdatedBy(task.getUpdatedBy());
        oldTask.setDescription(task.getDescription());
        oldTask.setCreatedBy(task.getCreatedBy());
        oldTask.setCreatedAt(task.getCreatedAt());
        oldTask.setAssignee(task.getAssignee());

        assert user != null;
        task.setUpdatedBy(user.getUsername());
        task.setStatus(taskRequest.getStatus());
        task.setDescription(taskRequest.getDescription());

        if (taskRequest.getProject() != null && !taskRequest.getProject().trim().isEmpty()) {
            Project project = projectRepository.findById(taskRequest.getProject()).orElse(null);
            task.setProject(project);
        }

        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setDescription("UPDATED STATUS TO: " + task.getStatus());
        reportDTO.setPerformedBy(user.getId());
        reportDTO.setCreatedAt(new Date().getTime());
        reportDTO.setTaskId(task.getId());
        reportClient.postReport(reportDTO);
        Task newTask = taskRepository.save(task);

        // Evict from Redis cache
        taskCacheService.evictOpenTask();
        taskCacheService.evictTaskEntriesCache();
        sprintCacheService.evictSprintCache();
        if (task.getAssignee() != null) {
            Settings assigneeSettings = settingsRepository.findUserSettings(newTask.getAssignee().getId());
            if (assigneeSettings == null) {
                Settings setAssigneeSettings = new Settings();
                setAssigneeSettings.setAppliedTo(newTask.getAssignee());
                assigneeSettings = settingsRepository.save(setAssigneeSettings);
            }
            if (assigneeSettings.getSendEmailUponTaskUpdate().equals(StringCodes.TRUE.getFlag())) {
                emailService.sendTemplatedEmail(
                        task.getAssignee().getEmail(),
                        "TASK_UPDATED_EMAIL",
                        Map.of(
                                "assigneeName", user.getUsername(),
                                "description", "You updated task '" + task.getTaskName() + "'",
                                "taskName", task.getTaskName(),
                                "before", oldTask.getStatus(),
                                "after", task.getStatus(),
                                "taskUrl", "https://taskmasteropnexus.xyz/tasks/view/" + newTask.getId()
                        )
                );
            }
        }
        //send sa creator
        Settings settings = settingsRepository.findUserSettings(newTask.getCreatedBy().getId());

        if (settings == null) {
            Settings createdBySettings = new Settings();
            createdBySettings.setAppliedTo(task.getCreatedBy());
            settings = settingsRepository.save(createdBySettings);
        }

        if (settings.getSendEmailUponTaskUpdate().equals(StringCodes.TRUE.getFlag())) {
            emailService.sendTemplatedEmail(
                    task.getCreatedBy().getEmail(),
                    "TASK_UPDATED_EMAIL",
                    Map.of(
                            "assigneeName", task.getCreatedBy().getUsername(),
                            "description", "Task " + task.getTaskName() + " was updated by " + task.getUpdatedBy(),
                            "taskName", task.getTaskName(),
                            "before", oldTask.getStatus(),
                            "after", task.getStatus(),
                            "taskUrl", "https://taskmasteropnexus.xyz/tasks/view/" + newTask.getId()
                    )
            );
        }


        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.update("TASK UPDATED", "SUCCESS", newTask, oldTask));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Task>> getTaskById(String id) {
        // Fetch raw Task via TaskCacheService (@Cacheable is inside TaskCacheService)
        Task task = taskCacheService.getTaskByIdCached(id);

        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseModel.error("TASK NOT FOUND", "ERROR"));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("TASK FOUND", "SUCCESS", task));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getProjectTask(String id) {
        List<Task> tasks = taskCacheService.getProjectTaskCached(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASKS FOUND", "SUCCESS", tasks));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getAllOpenTask() {
        User user = authenticatedUser.getAuthenticatedUser();
        List<Task> tasks = taskCacheService.getAllOpenTaskCache(user.getId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASKS FOUND", "SUCCESS", tasks));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> archiveTasks() {
        taskRepository.archiveTask();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("TASKS ARCHIVED BY SCHEDULER", "SUCCESS", null));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getArchiveTasks() {
        List<Task> tasks = taskCacheService.getArchiveTasksCache();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("ARCHIVE TASKS FOUND", "SUCCESS", tasks));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Task>> setToArchive(String id, TaskRequest toArchive) {

        Task task = taskRepository.findById(id).orElse(null);
        User user = authenticatedUser.getAuthenticatedUser();
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseModel.error("TASK NOT FOUND", "ERROR"));
        }

        task.setArchived(toArchive.getToArchive().equals(StringCodes.TRUE.getFlag()) ? 1 : 0);

        task.setUpdatedBy(user.getUsername());
        taskCacheService.evictArchiveTask();
        taskCacheService.evictTaskEntriesCache();
        Task newTask = taskRepository.save(task);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("TASK ARCHIVED", "SUCCESS", newTask));
    }
}