package com.example.backend.repository;

import com.example.backend.model.Sprint;
import com.example.backend.model.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, String> {

    @Query("SELECT s FROM Sprint s JOIN s.sprintMembers m WHERE m.id = :userId OR s.initiatedBy.id = :userId AND s.del = 0")
    List<Sprint> getSprints(@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query("UPDATE Sprint s SET s.finished = 1 WHERE s.id = :id")
    void finishSprint(String id);

    @Query("SELECT s FROM Sprint s WHERE s.finished = 1 AND s.del = 0")
    List<Sprint> getFinishedSprints ();
}
