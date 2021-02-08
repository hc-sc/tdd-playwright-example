package org.example.http.error;

// import main.java.org.example.http;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.example.http.error.EntityNotFoundException;
// import org.example.entities.http.ApiError;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.web.context.WebApplicationContext;
import io.restassured.RestAssured;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import io.restassured.response.Response;
import net.bytebuddy.NamingStrategy.AbstractBase;

import static io.restassured.RestAssured.*;
import static io.restassured.matcher.RestAssuredMatchers.*;
import static org.hamcrest.Matchers.*;

@Tag("integration")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT) // automatically scans for @SpringBootApplication

public class ErrorUnitTests { // make it abstract so it isn't instantiated by Spring Test

    @LocalServerPort
    int port; // autowired to be set to whichever port the application is served on

    @Autowired
    public WebApplicationContext webApplicationContext; // use the whole application context

    private String path;

    @BeforeEach
    public void init() {
        RestAssured.port = port; // need to tell rest-assured which port to listen on
        RestAssuredMockMvc.webAppContextSetup(webApplicationContext); // stand up the whole application
        path = "/employees";
    }


    @Test
    public void whenTry_thenOK() {
        path += "/1";
        final Response response = given().get(path);
        assertEquals(200, response.statusCode());
        // System.out.println(response.asString());
    }

    @Test
    public void whenNoHandlerForHttpRequest_thenNotFound() {
        path += "/3543543";
        assertResponse(given().get(path), 404, "Not Found", "Entity Not Found", path);
    }


    // @Test
    // public void whenHttpRequestMethodNotSupported_thenMethodNotAllowed() {
    //     // assertResponse(delete(path), "METHOD_NOT_ALLOWED", "Not allowed", "Request method 'DELETE' not supported");
    // }

    @Test
    public void whenSendInvalidHttpMediaType_thenUnsupportedMediaType() {
        path += "/add";
        assertResponse(given().body("").post(path), "UNSUPPORTED_MEDIA_TYPE", "Content type 'text/plain;charset=ISO-8859-1' not supported");

    }

    // private JSONObject createProfile(String name, String role) throws JSONException {
    //     JSONObject anEmployee = new JSONObject();
    //     anEmployee.put("name", name);
    //     anEmployee.put("role", role);
    //     return anEmployee;
    // }

        private void assertResponse(Response response, int status, String error, String message, String path){
            System.out.println(response.toString());
            response.then()
            .body("status", equalTo(status))
            .body("error", containsString(error))
            .body("message", containsString(message))
            .body("path", containsString(path));
        }

        private void assertResponse(Response response, String status, String message){
            System.out.println(response.toString());
            response.then()
            .body("status", containsString(status))
            // .body("error[0]", containsString(error))
            .body("message", containsString(message));
            // .body("path", containsString(path));
        }


}



