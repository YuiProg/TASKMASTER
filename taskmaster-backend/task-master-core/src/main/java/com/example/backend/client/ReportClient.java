package com.example.backend.client;

import com.example.backend.config.FeignCookieConfig;
import com.example.backend.dto.ReportDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


//@FeignClient(name = "backend-reports-service", url = "http://localhost:8082/api/v1", configuration = FeignCookieConfig.class)
@FeignClient(name = "backend-reports-service", url = "${services.report.url}", configuration = FeignCookieConfig.class)
public interface ReportClient {

    @PostMapping(value = "/newReport", consumes = "application/json", produces = "application/json")
    void postReport (@RequestBody ReportDTO reportDTO);
}
