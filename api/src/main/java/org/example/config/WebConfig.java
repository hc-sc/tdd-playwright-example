package org.example.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("endpoints.properties")
public class WebConfig {
  private static final Logger log = LoggerFactory.getLogger(WebConfig.class);
}
