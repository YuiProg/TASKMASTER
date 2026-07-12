package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal price;

    @JoinColumn(name = "branch_id", nullable = false)
    @ManyToOne()
    private Branch branchLocation;

    @JoinColumn(name = "created_by", nullable = false)
    @ManyToOne()
    private User createdBy;

    @Column(nullable = true)
    private String createdDate;
}
