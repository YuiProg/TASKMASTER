package com.example.gateway_service.gateway;

import com.example.gateway_service.gateway.client.CommentClient;
import com.example.gateway_service.gateway.client.ProjectClient;
import com.example.gateway_service.gateway.client.TaskClient;
import com.example.gateway_service.gateway.client.UserClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(clients = {
		UserClient.class,
		CommentClient.class,
		TaskClient.class,
		ProjectClient.class
})
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

}
