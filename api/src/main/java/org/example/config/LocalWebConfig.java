package org.example.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Only loads when profile == "local"
@Profile("local")
@Configuration
public class LocalWebConfig implements WebMvcConfigurer {
  Logger logger = LoggerFactory.getLogger(this.getClass());
}