package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

// import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

// @EnableWebSecurity
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@SpringBootApplication
public class Application extends SpringBootServletInitializer {
  public static void main(String... args) {
    SpringApplication.run(Application.class, args);
  }
}