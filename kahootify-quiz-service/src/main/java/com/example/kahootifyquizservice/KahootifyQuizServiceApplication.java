package com.example.kahootifyquizservice;

import com.example.kahootifyquizservice.config.CorsProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CorsProperties.class)
public class KahootifyQuizServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(KahootifyQuizServiceApplication.class, args);
    }

}
