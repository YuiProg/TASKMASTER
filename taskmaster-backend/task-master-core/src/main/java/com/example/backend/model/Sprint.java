package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String sprintName;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project projectId;

    @ManyToOne
    @JoinColumn(name = "initiated_by", nullable = false)
    private User initiatedBy;

    @Column(nullable = true)
    private Long deadline;

    @Column(nullable = false)
    private Long createdAt;

    @Column(nullable = false)
    private String updatedBy;

    @ManyToMany
    @JoinTable(
            name = "sprint_members",
            joinColumns = @JoinColumn(name = "sprint_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> sprintMembers;

    @ManyToMany
    @JoinTable(
            name = "sprint_tasks",
            joinColumns = @JoinColumn(name = "sprint_id"),
            inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    private List<Task> sprintTasks;

    private Integer del = 0;
    private Integer finished = 0;

}
