package org.example.pages.index.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
// import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class SecurityController {

    // @PreAuthorize("hasRole('ROLE_Users')")
    // @RequestMapping("/")
    // public String helloWorld() {
    // return "Hello Users!";
    // }

    @PreAuthorize("hasRole('ROLE_group1')")
    @GetMapping("/Group1")
    public String groupOne() {
        return "groups";
    }

    // @PreAuthorize("hasRole('ROLE_group2')")
    @RequestMapping("/Group2")
    public String groupTwo() {
        return "groups";
    }

}
