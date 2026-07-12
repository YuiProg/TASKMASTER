package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Product;
import com.example.backend.request.ProductRequest;
import com.example.backend.service.ProductService.ProductServiceInterface;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController implements ProductServiceInterface {

    @Autowired
    private final ProductServiceInterface productServiceInterface;

    @Override
    @PostMapping("/api/v1/addProduct")
    public ResponseEntity<ApiResponseModel<Product>> addProduct(@RequestBody ProductRequest productRequest, HttpServletRequest request) {
        return productServiceInterface.addProduct(productRequest, request);
    }

    @Override
    @GetMapping("/api/v1/getProducts")
    public ResponseEntity<ApiResponseModel<List<Product>>> getProducts() {
        return productServiceInterface.getProducts();
    }

    @Override
    @PutMapping("/api/v1/updateProduct/{id}")
    public ResponseEntity<ApiResponseModel<Product>> updateProduct(@PathVariable String id, @RequestBody ProductRequest productRequest) {
        return productServiceInterface.updateProduct(id, productRequest);
    }

    @Override
    @DeleteMapping("/api/v1/deleteProduct/{id}")
    public ResponseEntity<ApiResponseModel<Product>> deleteProduct(@PathVariable String id) {
        return productServiceInterface.deleteProduct(id);
    }
}
