package com.example.scheduler_service.scheduler.client;


import com.example.scheduler_service.scheduler.config.FeignCookieConfig;
import com.example.scheduler_service.scheduler.dto.ApiResponseModel;
import com.example.scheduler_service.scheduler.dto.SprintDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

//@FeignClient(name = "backend-sprint-client", url = "http://localhost:8080/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-sprint-client", url = "${services.backend.url}", configuration = FeignCookieConfig.class)
public interface SprintClient {

    @PutMapping("/archiveSprints")
    ResponseEntity<ApiResponseModel<List<SprintDTO>>> scheduledArchiveSprints();
}
