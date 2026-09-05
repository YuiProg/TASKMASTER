package com.example.backend.controller;

import com.example.backend.dto.ApiResponseModel;
import com.example.backend.model.Sprint;
import com.example.backend.request.SprintRequest;
import com.example.backend.service.SprintService.SprintServiceInterface;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController()
@RequestMapping("/api/v1")
@AllArgsConstructor
public class SprintController implements SprintServiceInterface {

    private final SprintServiceInterface sprintServiceInterface;

    @Override
    @PostMapping("/createSprint")
    public ResponseEntity<ApiResponseModel<Sprint>> createSprint(@RequestBody SprintRequest sprintRequest) {
        return sprintServiceInterface.createSprint(sprintRequest);
    }

    @Override
    @GetMapping("/getSprints")
    public ResponseEntity<ApiResponseModel<List<Sprint>>> getSprints() {
        return sprintServiceInterface.getSprints();
    }

    @Override
    @GetMapping("/getSprintById/{id}")
    public ResponseEntity<ApiResponseModel<Sprint>> getSprintById(@PathVariable String id) {
        return sprintServiceInterface.getSprintById(id);
    }

    @Override
    @PutMapping("/archiveSprints")
    public ResponseEntity<ApiResponseModel<List<Sprint>>> scheduledArchiveSprint() {
        return sprintServiceInterface.scheduledArchiveSprint();
    }

    @Override
    @PutMapping("/softDeleteSprint")
    public ResponseEntity<ApiResponseModel<List<Sprint>>> softDeleteSprints() {
        return sprintServiceInterface.softDeleteSprints();
    }
}
