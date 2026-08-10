package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail (String email);

    User findByUsername(String username);

    boolean existsByEmail (String email);

    boolean existsByUsername (String username);

    @Query("SELECT u FROM User u WHERE u.del = 0 ORDER BY RANDOM() LIMIT 10")
    List<User> findRandomUsers();
}
