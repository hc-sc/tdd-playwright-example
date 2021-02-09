package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import goc.webtemplate.component.spring.WebConfigSpring;

@Configuration
@PropertySource(value = "endpoints.properties", name = "endpoints")
@Import(WebConfigSpring.class)
public class WebConfig implements WebMvcConfigurer {
}
