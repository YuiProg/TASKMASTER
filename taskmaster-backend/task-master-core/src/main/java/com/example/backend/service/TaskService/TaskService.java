package com.example.backend.service.TaskService;

import com.example.backend.client.ReportClient;
import com.example.backend.config.AuthenticatedUser;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.dto.ReportDTO;
import com.example.backend.model.Project;
import com.example.backend.model.Task;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.TaskRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService implements TaskServiceInterface {

    private final TaskRepository taskRepository;
    private final AuthenticatedUser authenticatedUser;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ReportClient reportClient;

    // Inject internal cache service
    private final TaskCacheService taskCacheService;

    @Override
    public ResponseEntity<ApiResponseModel<Task>> createTask(TaskRequest taskRequest) {
        Task task = new Task();

        User user = authenticatedUser.getAuthenticatedUser();
        task.setCreatedBy(user);
        task.setTaskName(taskRequest.getTaskName());

        User assignee = userRepository.findByEmail(taskRequest.getAssignee()).orElse(null);
        task.setAssignee(assignee);
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

        task.setProject(project);
        Task newTask = taskRepository.save(task);

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
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
            }
            task.setAssignee(assignee);
            log = String.format("UPDATED ASSIGNEE TO %s", assignee.getUsername());
        }

        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setTaskId(task.getId());
        reportDTO.setDescription(log);
        reportDTO.setPerformedBy(authUser.getId());
        reportDTO.setCreatedAt(new Date().getTime());
        reportClient.postReport(reportDTO);
        Task newTask = taskRepository.save(task);

        // Evict from Redis cache
        taskCacheService.evictTaskCache(taskId);

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

        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("TASK NOT FOUND", "ERROR"));
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

        User user = authenticatedUser.getAuthenticatedUser();
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
        taskCacheService.evictTaskCache(taskId);

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
        List<Task> tasks = taskCacheService.getAllOpenTaskCache();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASKS FOUND", "SUCCESS", tasks));
    }
}