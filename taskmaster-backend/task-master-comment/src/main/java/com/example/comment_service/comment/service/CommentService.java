package com.example.comment_service.comment.service;

import com.example.comment_service.comment.Request.CommentRequest;
import com.example.comment_service.comment.client.ProjectClient;
import com.example.comment_service.comment.client.TaskClient;
import com.example.comment_service.comment.client.UserClient;
import com.example.comment_service.comment.config.AuthenticatedUser;
import com.example.comment_service.comment.dto.*;
import com.example.comment_service.comment.models.Comment;
import com.example.comment_service.comment.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CommentService implements CommentServiceInterface{

    private final CommentRepository commentRepository;
    private final UserClient userClient;
    private final ProjectClient projectClient;
    private final AuthenticatedUser authenticatedUser;
    private final TaskClient taskClient;

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<CommentResponseDTO>> newComment(CommentRequest commentRequest) {
        UserDTO user = authenticatedUser.getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
        }

        //ApiResponseModel<ProjectDTO> project = projectClient.getProjectById(commentRequest.getProjectId());
        ApiResponseModel<TaskDTO> task = taskClient.getTaskById(commentRequest.getTaskId());
        CommentResponseDTO commentResponseDTO = new CommentResponseDTO();

        Comment comment = new Comment();

        comment.setTask(task.getData().getId());
        comment.setComment(commentRequest.getComment());
        comment.setCreatedBy(user.getId());
        comment.setUpdatedBy(user.getUsername());

        Comment newComment = commentRepository.save(comment);

        commentResponseDTO.setId(newComment.getId());
        commentResponseDTO.setLike(comment.getLike());
        commentResponseDTO.setTask(task.getData());
        commentResponseDTO.setComment(commentRequest.getComment());
        commentResponseDTO.setCreatedBy(user);
        commentResponseDTO.setUpdatedBy(user.getUsername());

//        CommentResponseDTO commentResponseDTO = new CommentResponseDTO(newComment, user.getData());

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("COMMENT POSTED","SUCCESS", commentResponseDTO));
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponseModel<Comment>> editComment(String id, CommentRequest commentRequest) {

        Comment comment = commentRepository.findById(id).orElse(null);

        if (comment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("COMMENT NOT FOUND", "ERROR"));
        }

        UserDTO user = authenticatedUser.getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
        }

        Comment oldComment;
        oldComment = new Comment();
        oldComment.setComment(comment.getComment());
        oldComment.setUpdatedBy(comment.getUpdatedBy());
        oldComment.setLike(comment.getLike());
        oldComment.setId(comment.getId());
        oldComment.setCreatedBy(comment.getCreatedBy());
        oldComment.setTask(comment.getTask());

        boolean changed = false;

        if (commentRequest.getComment() != null && !commentRequest.getComment().trim().isEmpty()) {
            comment.setComment(commentRequest.getComment());
            comment.setUpdatedBy(user.getUsername());
            changed = true;
        }

        if (!changed) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error("NO CHANGES MADE", "ERROR"));
        }

        Comment newComment = commentRepository.save(comment);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.update("COMMENT EDITED", "SUCCESS", newComment, oldComment));
    }

    @Override
    public ResponseEntity<ApiResponseModel<List<CommentResponseDTO>>> getTaskComments(String taskId) {

        List<Comment> comments = commentRepository.getTaskComments(taskId);
        ApiResponseModel<TaskDTO> task = taskClient.getTaskById(taskId);

        List<CommentResponseDTO> commentResponseDTOs = comments.stream()
                .map(comment -> {
                    CommentResponseDTO dto = new CommentResponseDTO();
                    UserDTO user = authenticatedUser.getAuthenticatedUser();
                    dto.setId(comment.getId());
                    dto.setComment(comment.getComment());
                    dto.setCreatedBy(user);
                    dto.setUpdatedBy(comment.getUpdatedBy());
                    dto.setLike(comment.getLike());
                    dto.setTask(task.getData());
                    return dto;
                }).collect(Collectors.toList());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponseModel.success("COMMENTS FOUND", "SUCCESS", commentResponseDTOs));
    }
}
