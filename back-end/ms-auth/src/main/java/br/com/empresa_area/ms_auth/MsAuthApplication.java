package br.com.empresa_area.ms_auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "br.com.empresa_area.ms_auth.repositories")
public class MsAuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsAuthApplication.class, args);
    }
}
