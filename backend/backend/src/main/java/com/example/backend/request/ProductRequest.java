package com.example.backend.request;

import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    public String id;
    public String productName;
    public String category;
    public Integer quantity;
    public BigDecimal price;
    public String branchId;
    public User createdBy;
    public String createdDt;
}
