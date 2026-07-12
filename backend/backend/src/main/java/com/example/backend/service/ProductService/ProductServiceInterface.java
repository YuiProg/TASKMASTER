package com.example.backend.service.ProductService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Product;
import com.example.backend.request.ProductRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductServiceInterface {
    ResponseEntity<ApiResponseModel<Product>> addProduct (ProductRequest productRequest, HttpServletRequest request);
    ResponseEntity<ApiResponseModel<List<Product>>> getProducts ();
    ResponseEntity<ApiResponseModel<Product>> updateProduct (String id, ProductRequest productRequest);
    ResponseEntity<ApiResponseModel<Product>> deleteProduct (String id);
}
