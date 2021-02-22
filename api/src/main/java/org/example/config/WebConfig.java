package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@PropertySource(value = "endpoints.properties", name = "endpoints")
@PropertySource(value = "application.properties", name = "properties")
public class WebConfig implements WebMvcConfigurer {

  @Value("${service.url}")
  String serviceURL;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // all endpoints
        .allowedOrigins(serviceURL).allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS"); // specific
    System.out.println("SERVICE URL: " + serviceURL);
  }

  // ignore 'Accept' header (we use CustomContentNegotiationStrategy instead)
  @Override
  public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer.defaultContentTypeStrategy(new CustomContentNegotiationStrategy()).ignoreAcceptHeader(true);
  }

  // public void setValues(@Value("${service.url}") String rootUrl) {
  // this.baseURL = rootUrl + "/" + employeesEndPoint;
  // log.debug("baseURL: " + this.baseURL);
  // }
}