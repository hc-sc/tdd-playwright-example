package org.example.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;

// Only loads when profile == "local"
@Profile("local")
@PropertySource(value = "application.properties", name = "properties")
@Configuration
public class LocalWebConfig implements WebMvcConfigurer {
  Logger logger = LoggerFactory.getLogger(this.getClass());

  @Value("${service.url}")
  String serviceURL;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // all endpoints
        .allowedOrigins(serviceURL).allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS"); // specific
    logger.info("CORS URL: " + serviceURL);
  }

}