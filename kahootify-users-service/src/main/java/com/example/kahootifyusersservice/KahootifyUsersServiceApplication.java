package com.example.kahootifyusersservice;

import com.example.kahootifyusersservice.config.CorsProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CorsProperties.class)
public class KahootifyUsersServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(KahootifyUsersServiceApplication.class, args);
    }

}
