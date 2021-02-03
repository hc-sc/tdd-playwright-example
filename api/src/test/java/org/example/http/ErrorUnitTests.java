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

    @BeforeEach
    public void init() {
        RestAssured.port = port; // need to tell rest-assured which port to listen on
        RestAssuredMockMvc.webAppContextSetup(webApplicationContext); // stand up the whole application
    }


    @Test
    public void whenTry_thenOK() {
        final Response response = given().get("/employees/1");
        assertEquals(200, response.statusCode());
        System.out.println(response.asString());
    }

    // @Test
    // public void whenEmployeeNotFound_thenBadRequest() {
    //     final Response response = given().get("/employees/540240210353");
    //     final ApiError error = response.as(ApiError.class);
    //     assertEquals(HttpStatus.NOT_FOUND, error.getStatus());
    //     // assertEquals(1, error.getErrors().size());
    //     // assertTrue(error.getErrors().get(0).contains("should be of type"));
    // }

    @Test
    public void whenNoHandlerForHttpRequest_thenNotFound() {
        final Response response = given().get("/employees/3543543");;
        // final ApiError error = response.as(ApiError.class); 

        response.then()
            .body("status", equalTo(404))
            .body("error", containsString("Not Found"))
            .body("message", containsString("Entity Not Found"))
            .body("path", containsString("/employees/3543543"));
    }


    // @Test
    // public void whenHttpRequestMethodNotSupported_thenMethodNotAllowed() {
    //     final Response response = givenAuth().delete(URL_PREFIX + "/2");
    //     final ApiError error = response.as(ApiError.class);
    //     assertEquals(HttpStatus.METHOD_NOT_ALLOWED, error.getStatus());
    //     assertEquals(1, error.getErrors().size());
    //     assertTrue(error.getErrors().get(0).contains("Supported methods are"));
    //     System.out.println(response.asString());

    // }

    // @Test
    // public void whenSendInvalidHttpMediaType_thenUnsupportedMediaType() {
    //     final Response response = givenAuth().body("").post(URL_PREFIX + "/");
    //     final ApiError error = response.as(ApiError.class);
    //     assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, error.getStatus());
    //     assertEquals(1, error.getErrors().size());
    //     assertTrue(error.getErrors().get(0).contains("media type is not supported"));
    //     System.out.println(response.asString());

    // }

    // private JSONObject createProfile(String name, String role) throws JSONException {
    //     JSONObject anEmployee = new JSONObject();
    //     anEmployee.put("name", name);
    //     anEmployee.put("role", role);
    //     return anEmployee;
    // }



}



