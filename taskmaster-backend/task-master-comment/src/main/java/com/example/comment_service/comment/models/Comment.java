package com.example.comment_service.comment.models;

import com.example.comment_service.comment.dto.ProjectDTO;
import com.example.comment_service.comment.dto.TaskDTO;
import com.example.comment_service.comment.dto.UserDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String comment;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    private String updatedBy;

    @Column(name = "like_count")
    private Integer like = 0;

    @Column(name = "task_id", nullable = false)
    private String task;
}