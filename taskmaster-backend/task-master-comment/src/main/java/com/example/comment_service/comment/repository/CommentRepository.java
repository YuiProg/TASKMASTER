package com.example.comment_service.comment.repository;

import com.example.comment_service.comment.models.Comment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

    @Query(value = "SELECT c.* FROM comments c WHERE c.task_id = :taskId",
            nativeQuery = true)
    List<Comment> getTaskComments(@Param("taskId") String taskId);


    @Modifying
    @Transactional
    @Query("DELETE FROM comments c WHERE c.id = :taskId")
    void deleteCommentByTaskId(String taskId);
}
