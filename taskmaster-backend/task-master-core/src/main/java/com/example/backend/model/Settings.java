package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "settings")
@NoArgsConstructor
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "applied_to")
    private User appliedTo;

    private Boolean sendEmailUponProjectCreation = true;

    private Boolean sendEmailUponTaskCreation = true;

    private Boolean sendEmailUponLogin = true;

    private Boolean sendEmailUponTaskUpdate = true;

    private Boolean sendDailyEmailTaskUpdates = true;

    private Boolean locked = false;
}
