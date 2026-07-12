package com.example.backend.service.ProductService;

import com.example.backend.config.JwtUtil;
import com.example.backend.constants.StringCodes;
import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Branch;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.BranchRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.ProductRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService implements ProductServiceInterface{

    private final EntityManager entityManager;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    private final BranchRepository branchRepository;

    private final JwtUtil jwtUtil;

    @Override
    public ResponseEntity<ApiResponseModel<Product>> addProduct(ProductRequest productRequest, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromCookie(request);
            String userIdToken = jwtUtil.extractSubject(token);

            User user = userRepository.findById(userIdToken).orElse(null);
            Branch branch = branchRepository.findById(productRequest.getBranchId()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
            }

            if (productRequest.getProductName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error("Product Name is Required!", "ERROR"));
            }

            //add more validation here later noh

            Product product = new Product();

            product.setProductName(productRequest.getProductName());
            product.setCategory(productRequest.getCategory());
            product.setPrice(productRequest.getPrice());
            product.setQuantity(productRequest.getQuantity());
            product.setBranchLocation(branch);
            product.setCreatedBy(user);
            product.setCreatedDate(String.valueOf(new Date()));

            Product newProduct = productRepository.save(product);
            log.info("INSERT INTO product (product_name, category, price, quantity, branch_location, created_by, created_dt) VALUES ({}, {}, {}, {}, {}, {}, {})",
                    productRequest.getProductName(),
                    productRequest.getCategory(),
                    productRequest.getPrice(),
                    productRequest.getQuantity(),
                    productRequest.getBranchId(),
                    user.getUsername(),
                    new Date()
                    );
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseModel.success(StringCodes.PRODUCT_ADDED.getPath(), "SUCCESS", newProduct));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseModel.error(e.getMessage(), "ERROR"));
        }
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<Product>>> getProducts() {
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT * FROM product");
            log.info("SELECT * FROM product");
            Query query = entityManager.createNativeQuery(sql.toString(), Product.class);

            List<Product> products = query.getResultList();

            return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponseModel.success(StringCodes.PRODUCT_FOUND.getPath(), "SUCCESS", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseModel.error(e.getMessage(), "ERROR"));
        }
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Product>> updateProduct(String id, ProductRequest productRequest) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE product SET ");

        StringBuilder oldProductSql = new StringBuilder();
        oldProductSql.append("SELECT * FROM product WHERE id = :id");
        Query oldProductQuery = entityManager.createNativeQuery(oldProductSql.toString(), Product.class);
        oldProductQuery.setParameter("id", id);
        Product oldProduct = (Product) oldProductQuery.getSingleResult();

        boolean dynamicUpdate = false;

        Branch branch = branchRepository.findById(productRequest.getBranchId()).orElse(null);

        if (branch == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseModel.error("BRANCH NOT FOUND", "ERROR"));
        }

        if (productRequest.getProductName() != null && !productRequest.getProductName().trim().isEmpty()) {
            sql.append("product_name = :productName");
            dynamicUpdate = true;
        }

        if (productRequest.getBranchId() != null) {
            if (dynamicUpdate) sql.append(", ");
            sql.append("branch_id = :branchId");
            dynamicUpdate = true;
        }

        if (productRequest.getPrice() != null) {
            if (dynamicUpdate) sql.append(", ");
            sql.append("price = :price");
            dynamicUpdate = true;
        }

        if (productRequest.getCategory() != null && !productRequest.getCategory().trim().isEmpty()) {
            if (dynamicUpdate) sql.append(", ");
            sql.append("category = :category");
            dynamicUpdate = true;
        }

        if (productRequest.getQuantity() != null) {
            if (dynamicUpdate) sql.append(", ");
            sql.append("quantity = :quantity");
            dynamicUpdate = true;
        }

        if (!dynamicUpdate) {
            return ResponseEntity.ok(ApiResponseModel.success("No changes detected", "SUCCESS", oldProduct));
        }

        sql.append(" WHERE id = :id");

        Query updateQuery = entityManager.createNativeQuery(sql.toString(), Product.class);
        updateQuery.setParameter("id", id);

        if (productRequest.getProductName() != null && !productRequest.getProductName().trim().isEmpty()) {
            updateQuery.setParameter("productName", productRequest.getProductName());
        }

        if (productRequest.getBranchId() != null) {
            updateQuery.setParameter("branchId", productRequest.getBranchId());
        }

        if (productRequest.getPrice() != null) {
            updateQuery.setParameter("price", productRequest.getPrice());
        }

        if (productRequest.getCategory() != null && !productRequest.getCategory().trim().isEmpty()) {
            updateQuery.setParameter("category", productRequest.getCategory());
        }

        if (productRequest.getQuantity() != null) {
            updateQuery.setParameter("quantity", productRequest.getQuantity());
        }

        updateQuery.executeUpdate();

        entityManager.flush();
        entityManager.clear();

        Query newProductQuery = entityManager.createNativeQuery("SELECT * FROM product WHERE id = :id", Product.class);
        newProductQuery.setParameter("id", id);
        Product newProduct = (Product) newProductQuery.getSingleResult();

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.update(StringCodes.PRODUCT_UPDATED.getPath(), "SUCCESS", newProduct, oldProduct));
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Product>> deleteProduct(String id) {
        try {
            if (id == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error("No product found", "ERROR"));
            }
            log.info("SELECT * FROM product WHERE id = {}", id);
            Product oldProduct = productRepository.findById(id).orElse(null);

            StringBuilder sql = new StringBuilder();

            sql.append("DELETE FROM product WHERE id = :id");

            Query query = entityManager.createNativeQuery(sql.toString());
            query.setParameter("id", id);
            query.executeUpdate();
            log.info("Successfully deleted product. ID: {}, Name: {}", oldProduct.getId(), oldProduct.getProductName());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("PRODUCT DELETED", "SUCCESS", oldProduct));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseModel.error(e.getMessage(), "ERROR"));
        }
    }
}
