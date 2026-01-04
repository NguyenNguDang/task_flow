package com.tinyjira.kanban;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@EnableAsync
@EnableWebSecurity
@SpringBootApplication
public class KanbanApplication {

	public static void main(String[] args) {
        Dotenv.configure().systemProperties().load();
		SpringApplication.run(KanbanApplication.class, args);
	}
}
