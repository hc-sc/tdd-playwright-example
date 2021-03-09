package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@PropertySource(value = "endpoints.properties", name = "endpoints")
@PropertySource(value = "application.properties", name = "properties")
public class WebConfig implements WebMvcConfigurer {

  Logger log = LoggerFactory.getLogger(this.getClass());

  @Value("${service.url}")
  String serviceURL;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // all endpoints
        .allowedOrigins("https://tdd-playwright-example-api.herokuapp.com")
        .allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS"); // specific
    log.info("CORS URL: " + serviceURL);
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