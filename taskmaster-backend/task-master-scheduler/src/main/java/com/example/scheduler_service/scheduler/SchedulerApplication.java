package com.example.scheduler_service.scheduler;

import com.example.scheduler_service.scheduler.client.TaskClient;
import com.example.scheduler_service.scheduler.client.UserClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableFeignClients(clients = {
		TaskClient.class,
		UserClient.class
})
public class SchedulerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchedulerApplication.class, args);
	}

}
