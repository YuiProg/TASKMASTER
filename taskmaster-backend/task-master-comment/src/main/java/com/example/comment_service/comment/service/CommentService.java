package com.example.comment_service.comment.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class CommentService implements CommentServiceInterface{

    private final CommentRepository commentRepository;
    private final UserClient userClient;
    private final ProjectClient projectClient;
    private final AuthenticatedUser authenticatedUser;
    private final TaskClient taskClient;
    private final Cloudinary cloudinary;

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

        if (commentRequest.getComment() == null && commentRequest.getImage().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error("COMMENT EMPTY", "ERROR"));
        }

        comment.setTask(task.getData().getId());
        if (commentRequest.getComment() != null && !commentRequest.getComment().trim().isEmpty()) {
            comment.setComment(commentRequest.getComment());
        }
        comment.setCreatedBy(user.getId());
        comment.setUpdatedBy(user.getUsername());

        if (commentRequest.getImage() != null && !commentRequest.getImage().trim().isEmpty()) {
            try {
                String imageData = commentRequest.getImage();

                Map<String, Object> res = cloudinary.uploader().upload(imageData, ObjectUtils.emptyMap());
                comment.setImageUrl((String) res.get("secure_url"));
                comment.setImageId((String) res.get("public_id"));
                log.info("image uploaded successfully url: {}, id: {}", res.get("secure_url"), res.get("public_id"));

            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponseModel.error(e.getMessage(), "ERROR"));
            }
        }

        Comment newComment = commentRepository.save(comment);
        commentResponseDTO.setImageId(newComment.getImageId());
        commentResponseDTO.setImageUrl(newComment.getImageUrl());
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
                    //UserDTO user = authenticatedUser.getAuthenticatedUser();
                    ApiResponseModel<UserDTO> user = userClient.getUserById(comment.getCreatedBy());
                    log.info("FETCHING CREATED BY FOR COMMENT ID: {} USER: {}", comment.getId(), user.getData().getId());
                    dto.setId(comment.getId());
                    dto.setImageId(comment.getImageId());
                    dto.setImageUrl(comment.getImageUrl());
                    dto.setComment(comment.getComment());
                    dto.setCreatedBy(user.getData());
                    dto.setUpdatedBy(comment.getUpdatedBy());
                    dto.setLike(comment.getLike());
                    dto.setTask(task.getData());
                    return dto;
                }).collect(Collectors.toList());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponseModel.success("COMMENTS FOUND", "SUCCESS", commentResponseDTOs));
    }

    @Override
    public ResponseEntity<ApiResponseModel<CommentResponseDTO>> deleteComment(String id) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponseModel.error("COMMENT NOT FOUND", "ERROR"));
        }

        if (comment.getImageId() != null && comment.getImageUrl() != null) {
            try {
                cloudinary.uploader().destroy(comment.getImageId(), ObjectUtils.emptyMap());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseModel.error(e.getMessage(), "ERROR"));
            }
        }

        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setImageId(comment.getImageId());
        dto.setImageUrl(comment.getImageUrl());
        dto.setComment(comment.getComment());
        dto.setUpdatedBy(comment.getUpdatedBy());
        dto.setLike(comment.getLike());

        commentRepository.deleteById(comment.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseModel.success("COMMENT DELETED", "SUCCESS", dto));
    }
}
