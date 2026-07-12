package com.example.backend.service.BranchService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Branch;
import com.example.backend.model.User;
import com.example.backend.request.BranchRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface BranchServiceInterface {
    ResponseEntity<ApiResponseModel<Branch>> addBranch (BranchRequest branchRequest, HttpServletRequest request);
    ResponseEntity<ApiResponseModel<List<Branch>>> getBranches ();
    ResponseEntity<ApiResponseModel<List<Branch>>> getBranchesByName(String branchLocation);
    ResponseEntity<ApiResponseModel<List<User>>> getUsersOnBranch (String id);
}
