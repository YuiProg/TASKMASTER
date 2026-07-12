package com.example.comment_service.comment;

import com.example.comment_service.comment.client.ProjectClient;
import com.example.comment_service.comment.client.TaskClient;
import com.example.comment_service.comment.client.UserClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(clients = {
		UserClient.class,
		ProjectClient.class,
		TaskClient.class
})
public class CommentApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommentApplication.class, args);
	}
}
