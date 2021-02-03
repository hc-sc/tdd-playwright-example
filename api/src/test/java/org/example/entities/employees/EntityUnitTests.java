package org.example.entities.employees;


// import main.java.org.example.http;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

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

public class EntityUnitTests { // make it abstract so it isn't instantiated by Spring Test

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
    public void test_findEmployeeById() {
        given().get("/employees/2").then().statusCode(200).body("name", equalTo("Billy"));
        given().get("/yolos/2").then().statusCode(200).body("name", equalTo("Billy"));
    }

    @Test
    public void test_findAll() {
        given().get("/employees").then().statusCode(200).body("employees.name[0]", equalTo("Alex"));
        given().get("/employees").then().statusCode(200).body("employees.name[1]", equalTo("Billy"));

        given().get("/yolos").then().statusCode(200).body("employees.name[0]", equalTo("Alex"));
        given().get("/yolos").then().statusCode(200).body("employees.name[1]", equalTo("Billy"));
    }

    @Test
    public void test_addEmployee() throws JSONException {
        given().header("Content-Type", "application/json").body(createProfile("Patty", "Minister of Health").toString())
                .when().post("/employees").then().statusCode(200);

        given().get("/employees").then().statusCode(200).body("employees.name[2]", equalTo("Patty"));

        given().get("/yolos").then().statusCode(200).body("employees.name[2]", equalTo("Patty"));

    }

    @Test
    public void test_addEmployees() throws JSONException {
        List<JSONObject> employees = new ArrayList<>();
        employees.add(createProfile("Justin Trudeau", "Liberal Leader")); // 4
        employees.add(createProfile("Jagmeet Singh", "NDP Leader")); // 5
        employees.add(createProfile("Erin O'Toole", "Conservative Leader")); // 6
        employees.add(createProfile("Yves-Francois Blanchet", "BQ Leader")); // 7

        given().header("Content-Type", "application/json").body(employees.toString()).when().post("/yolos/vrac")
                .then().statusCode(200);

                given().get("/employees/4").then().statusCode(200).body("name", equalTo("Justin Trudeau"));
                given().get("/employees/5").then().statusCode(200).body("name", equalTo("Jagmeet Singh"));
                given().get("/yolos/6").then().statusCode(200).body("name", equalTo("Erin O'Toole"));
                given().get("/yolos/7").then().statusCode(200).body("name", equalTo("Yves-Francois Blanchet"));
    }

    @Test
    public void test_updateEmployees() throws JSONException {
        
        given().header("Content-Type", "application/json").body(createProfile("Sally", "LL").toString())
                .when().put("/employees/1").then().statusCode(200);

        given().get("/employees/1").then().statusCode(200).body("name", equalTo("Sally"));
        given().get("/yolos/1").then().statusCode(200).body("name", equalTo("Sally"));
    }

    @Test
    public void test_deleteEmployee() {
        given().header("Content-Type", "application/json").when().delete("/employees/2").then().statusCode(200);
    }

    // @Test
    // public void whenMethodArgumentMismatch_thenBadRequest(){
    //     Response response =  given().get("/employees/2");
    //     ApiError error = response.as(ApiError.class);

    //     assertEquals(HttpStatus.BAD_REQUEST, error.getStatus());
    //     assertEquals(1, error.getErrors().size());
    //     assertTrue(error.getErrors().get(0).contains("should be of type"));
    // }

    private JSONObject createProfile(String name, String role) throws JSONException {
        JSONObject anEmployee = new JSONObject();
        anEmployee.put("name", name);
        anEmployee.put("role", role);
        return anEmployee;
    }



}