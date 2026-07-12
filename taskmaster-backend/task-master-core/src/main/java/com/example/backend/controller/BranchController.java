package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Branch;
import com.example.backend.model.User;
import com.example.backend.request.BranchRequest;
import com.example.backend.service.BranchService.BranchServiceInterface;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class BranchController implements BranchServiceInterface {

    private final BranchServiceInterface branchServiceInterface;

    @Override
    @PostMapping("/api/v1/addBranch")
    public ResponseEntity<ApiResponseModel<Branch>> addBranch(@RequestBody BranchRequest branchRequest, HttpServletRequest request) {
        return branchServiceInterface.addBranch(branchRequest, request);
    }

    @Override
    @GetMapping("/api/v1/getBranches")
    public ResponseEntity<ApiResponseModel<List<Branch>>> getBranches() {
        return branchServiceInterface.getBranches();
    }

    @Override
    @GetMapping("/api/v1/getBranchByName")
    public ResponseEntity<ApiResponseModel<List<Branch>>> getBranchesByName(@RequestParam String branchLocation) {
        return branchServiceInterface.getBranchesByName(branchLocation);
    }

    @Override
    @GetMapping("/api/v1/getUsersOnBranch/{id}")
    public ResponseEntity<ApiResponseModel<List<User>>> getUsersOnBranch(@PathVariable String id) {
        return branchServiceInterface.getUsersOnBranch(id);
    }
}
