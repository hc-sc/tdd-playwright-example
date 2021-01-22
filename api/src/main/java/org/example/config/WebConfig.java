package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@PropertySource(value = "endpoints.properties", name = "endpoints")
public class WebConfig implements WebMvcConfigurer {

  // ignore 'Accept' header (we use CustomContentNegotiationStrategy instead)
  @Override
  public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer.defaultContentTypeStrategy(new CustomContentNegotiationStrategy()).ignoreAcceptHeader(true);
  }
}
