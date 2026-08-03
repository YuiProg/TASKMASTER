package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "email_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "template_code", unique = true, nullable = false)
    private String templateCode;

    @Column(nullable = false)
    private String subject;

    @Column(name = "body_html", columnDefinition = "TEXT", nullable = false)
    private String bodyHtml;
}