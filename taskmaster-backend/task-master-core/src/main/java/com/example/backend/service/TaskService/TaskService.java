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
public class TaskService implements TaskServiceInterface{

    private final TaskRepository taskRepository;
    private final AuthenticatedUser authenticatedUser;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ReportClient reportClient;

    @Override
    public ResponseEntity<ApiResponseModel<Task>> createTask(TaskRequest taskRequest) {
        Task task;
        task = new Task();

        User user = authenticatedUser.getAuthenticatedUser();
        task.setCreatedBy(user);
        task.setTaskName(taskRequest.getTaskName());

        //find assignee by username
        User assignee = userRepository.findByEmail(taskRequest.getAssignee()).orElse(null);
        task.setTaskName(taskRequest.getTaskName());
        task.setAssignee(assignee);
        task.setUpdatedBy(user.getUsername());
        task.setCreatedAt(String.valueOf(new Date()));
        task.setDescription(taskRequest.getDescription());

        if (taskRequest.getStatus() != null && !taskRequest.getStatus().trim().isEmpty()) {
            task.setStatus(taskRequest.getStatus());
        }

        if (taskRequest.getProject() != null && !taskRequest.getProject().trim().isEmpty()) {
            Project project = projectRepository.getProjectByName(taskRequest.getProject());
            task.setProject(project);
        }
        Task newTask = taskRepository.save(task);

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
    public ResponseEntity<ApiResponseModel<Task>> updateTask(TaskRequest taskRequest) {
        return null;
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getAuthenticatedUserTask() {
        User user = authenticatedUser.getAuthenticatedUser();

        String userId = user.getId();

        List<Task> tasks = taskRepository.findAuthenticatedTaskByAssignee(userId);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASKS FOUND", "SUCCESS", tasks));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Task>> updateTaskStatus(String taskId, TaskRequest taskRequest) {
        Task task = taskRepository.findById(taskId).orElse(null);

        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("TASK NOT FOUND", "ERROR"));
        }

        Task oldTask;
        oldTask = new Task();
        oldTask.setId(task.getId());
        oldTask.setTaskName(task.getTaskName());
        oldTask.setStatus(task.getStatus());
        oldTask.setProject(task.getProject());
        oldTask.setUpdatedBy(task.getUpdatedBy());
        oldTask.setDescription(task.getDescription());
        oldTask.setCreatedBy(task.getCreatedBy());
        oldTask.setCreatedAt(task.getCreatedAt());
        oldTask.setAssignee(task.getAssignee());
        oldTask.setProject(task.getProject());


        User user = authenticatedUser.getAuthenticatedUser();
        task.setUpdatedBy(user.getUsername());
        task.setStatus(taskRequest.status);
        task.setDescription(taskRequest.getDescription());

        if (taskRequest.getProject() != null && !taskRequest.getProject().trim().isEmpty()) {
            Project project = projectRepository.findById(taskRequest.getProject()).orElse(null);
            task.setProject(project);
        }

        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setDescription("UPDATED STATUS TO: " + task.getStatus());
        reportDTO.setPerformedBy(user.getId());
        reportDTO.setCreatedAt(String.valueOf(new Date()));
        reportDTO.setTaskId(task.getId());
        reportClient.postReport(reportDTO);
        Task newTask = taskRepository.save(task);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.update("TASK UPDATED", "SUCCESS", newTask, oldTask));
    }

    @Override
    public ResponseEntity<ApiResponseModel<Task>> getTaskById(String id) {
        Task task = taskRepository.findById(id).orElse(null);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASK FOUND", "SUCCESS", task));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getProjectTask(String id) {
        List<Task> tasks = taskRepository.getTaskOnProject(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASKS FOUND", "SUCCESS", tasks));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Task>>> getAllOpenTask() {
        List<Task> tasks = taskRepository.getAllOpenTask();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("TASKS FOUND", "SUCCESS", tasks));
    }
}
