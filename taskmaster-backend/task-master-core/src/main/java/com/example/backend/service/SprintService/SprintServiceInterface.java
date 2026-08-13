package com.example.backend.service.SprintService;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Sprint;
import com.example.backend.request.SprintRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SprintServiceInterface {
    ResponseEntity<ApiResponseModel<Sprint>> createSprint (SprintRequest sprintRequest);
    ResponseEntity<ApiResponseModel<List<Sprint>>> getSprints ();
    ResponseEntity<ApiResponseModel<Sprint>> getSprintById (String id);
    ResponseEntity<ApiResponseModel<List<Sprint>>> scheduledArchiveSprint ();
}
