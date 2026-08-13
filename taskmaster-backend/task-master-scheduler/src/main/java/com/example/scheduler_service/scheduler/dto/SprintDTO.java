package com.example.scheduler_service.scheduler.dto;

import lombok.Data;
import org.apache.catalina.User;

import java.util.List;

@Data
public class SprintDTO {
    private String id;
    private String sprintName;
    private ProjectDTO projectId;
    private User initiatedBy;
    private Long deadline;
    private Long createdAt;
    private String updatedBy;
    private List<UserDTO> sprintMembers;
    private List<TaskDTO> sprintTasks;
    private Integer del;
    private Integer finished;
}
