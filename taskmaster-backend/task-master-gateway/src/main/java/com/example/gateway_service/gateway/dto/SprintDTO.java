package com.example.gateway_service.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprintDTO {
    private String id;
    private String sprintName;
    private ProjectDTO projectId;
    private UserDTO initiatedBy;
    private Long deadline;
    private Long createdAt;
    private String updatedBy;
    private List<UserDTO> sprintMembers;
    private List<TaskDTO> sprintTasks;
    private Integer del;
    private Integer finished;
}
