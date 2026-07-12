package com.example.backend.repository;

import com.example.backend.model.Branch;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, String> {

    List<Branch> findByBranchLocation(String branchLocation);

    @Query("SELECT u FROM User u WHERE u.branchLocation.id = :id")
    List<User> getUsersBranch(@Param("id") String id);
}
