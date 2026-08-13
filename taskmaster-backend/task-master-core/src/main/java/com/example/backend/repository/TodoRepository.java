package com.example.backend.repository;

import com.example.backend.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, String> {

    @Query("SELECT t FROM Todo t WHERE t.createdBy.id = :userId AND t.del = 0")
    List<Todo> getUserTodos(String userId);

    @Query("SELECT t FROM Todo t WHERE t.id = :id AND t.del = 0")
    Todo getTodoById(String id);
}
