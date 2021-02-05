package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import goc.webtemplate.component.spring.WebConfigSpring;

@Configuration
@Import(WebConfigSpring.class)
public class WebConfig implements WebMvcConfigurer {
}
