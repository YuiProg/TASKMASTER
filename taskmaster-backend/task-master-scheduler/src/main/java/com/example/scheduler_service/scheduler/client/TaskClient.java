package com.example.scheduler_service.scheduler.client;


import com.example.scheduler_service.scheduler.config.FeignCookieConfig;
import com.example.scheduler_service.scheduler.dto.ApiResponseModel;
import com.example.scheduler_service.scheduler.dto.TaskDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient(name = "backend-task-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-task-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface TaskClient {

    @PutMapping("/archiveTasks")
    ResponseEntity<ApiResponseModel<TaskDTO>> archiveTasks ();
}
