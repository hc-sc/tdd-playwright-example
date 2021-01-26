package org.example.entities.employees;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.web.context.WebApplicationContext;
import io.restassured.RestAssured;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import io.restassured.response.Response;
import net.bytebuddy.NamingStrategy.AbstractBase;

@Tag("integration")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT) // automatically scans for @SpringBootApplication

public abstract class AbstractBaseIntegrationTest { // make it abstract so it isn't instantiated by Spring Test

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
    public void test_01(){
        AbstractBaseIntegrationTest absCls = Mockito.mock(AbstractBaseIntegrationTest.class, Mockito.CALLS_REAL_METHODS);
        System.out.println(absCls.test_local().statusCode());
        assertEquals(absCls.test_local().getStatusCode(), 201);
    }

    
    public Response test_local() {
        return RestAssured.given().get("/employees");
        
    }
}