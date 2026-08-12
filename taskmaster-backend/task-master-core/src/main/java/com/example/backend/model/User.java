package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String role;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = true)
    private Branch branchLocation;

    @Column(name = "del", nullable = true)
    private Integer del = 0;

    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private List<Project> projects = new ArrayList<>();

    private String profilePicture;

    private String profilePictureId;
}
