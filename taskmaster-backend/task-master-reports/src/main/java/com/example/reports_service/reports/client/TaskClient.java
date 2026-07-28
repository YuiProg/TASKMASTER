package com.example.reports_service.reports.client;


import com.example.reports_service.reports.dto.ApiResponseModel;
import com.example.reports_service.reports.dto.TaskDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name = "backend-task-client", url = "http://localhost:8080/api/v1")
@FeignClient(name = "backend-task-client", url = "${services.backend.url}")
public interface TaskClient {
    @GetMapping("/getTaskById/{id}")
    ApiResponseModel<TaskDTO> getTaskById (@PathVariable String id);
}
