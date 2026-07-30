package com.example.backend.repository;

import com.example.backend.model.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, String> {

    @Query("SELECT t FROM Task t WHERE t.assignee.id = :id AND t.del = 0 AND t.status <> 'CLOSED' ORDER BY t.createdAt DESC")
    List<Task> findAuthenticatedTaskByAssignee (@Param("id") String id);

    @Query("SELECT t FROM Task t JOIN Project p ON t.project.id = p.id WHERE p.id = :id AND t.del = 0 ORDER BY t.createdAt DESC")
    List<Task> getTaskOnProject (@Param("id") String id);

    @Query("SELECT t FROM Task t WHERE t.status = 'OPEN' AND t.del = 0 ORDER BY t.createdAt DESC")
    List<Task> getAllOpenTask ();

    @Modifying
    @Transactional
    @Query("UPDATE Task t SET t.del = 1 WHERE t.status = 'CLOSED' AND t.del = 0")
    void archiveTask ();
}
