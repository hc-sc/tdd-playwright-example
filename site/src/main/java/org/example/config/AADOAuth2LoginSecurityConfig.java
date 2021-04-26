// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package org.example.security;

import com.azure.spring.aad.webapp.AADWebSecurityConfigurerAdapter;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AADOAuth2LoginSecurityConfig extends AADWebSecurityConfigurerAdapter {

    /**
     * Add configuration logic as needed.
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        http.authorizeRequests((requests) -> requests.anyRequest().authenticated());
        ;
        // Do some custom configuration

    }

    // @Bean
    // WebClient webClient(ClientRegistrationRepository
    // clientRegistrationRepository,
    // OAuth2AuthorizedClientRepository authorizedClientRepository) {
    // ServletOAuth2AuthorizedClientExchangeFilterFunction oauth2 = new
    // ServletOAuth2AuthorizedClientExchangeFilterFunction(
    // clientRegistrationRepository, authorizedClientRepository);
    // oauth2.setDefaultOAuth2AuthorizedClient(true);
    // return WebClient.builder().apply(oauth2.oauth2Configuration()).build();
    // }

}
