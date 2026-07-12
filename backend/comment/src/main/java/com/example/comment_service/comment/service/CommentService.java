package com.example.comment_service.comment.service;

import com.example.comment_service.comment.Request.CommentRequest;
import com.example.comment_service.comment.client.ProjectClient;
import com.example.comment_service.comment.client.TaskClient;
import com.example.comment_service.comment.client.UserClient;
import com.example.comment_service.comment.config.AuthenticatedUser;
import com.example.comment_service.comment.dto.ApiResponseModel;
import com.example.comment_service.comment.dto.ProjectDTO;
import com.example.comment_service.comment.dto.TaskDTO;
import com.example.comment_service.comment.dto.UserDTO;
import com.example.comment_service.comment.models.Comment;
import com.example.comment_service.comment.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
    public ResponseEntity<ApiResponseModel<Comment>> newComment(CommentRequest commentRequest) {
        UserDTO user = authenticatedUser.getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("USER NOT FOUND", "ERROR"));
        }

        //ApiResponseModel<ProjectDTO> project = projectClient.getProjectById(commentRequest.getProjectId());
        ApiResponseModel<TaskDTO> task = taskClient.getTaskById(commentRequest.getTaskId());
        Comment comment = new Comment();
        comment.setCreatedBy(user);
        comment.setUpdatedBy(user.getUsername());
        comment.setComment(commentRequest.getComment());
        comment.setTask(task.getData());
        Comment newComment = commentRepository.save(comment);

//        CommentResponseDTO commentResponseDTO = new CommentResponseDTO(newComment, user.getData());

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseModel.success("COMMENT POSTED","SUCCESS", newComment));
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
}
