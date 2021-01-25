package org.example.entities.employees;


import org.junit.jupiter.api.Test;

/*
import static io.restassured.module.mockmvc.RestAssuredMockMvc.*; //instead of .RestAssured.*
import static io.restassured.matcher.RestAssuredMatchers.*; //instead of .RestAssuredMathers.*
*/

import static io.restassured.RestAssured.*;
import static io.restassured.matcher.RestAssuredMatchers.*;
import static org.hamcrest.Matchers.*;


public class ExampleTest {

/*
    @Test
    void test_01() {
        Response response = get("https://reqres.in/api/users?page=2");
        System.out.println(response.asString());
        System.out.println(response.getBody().asString());
        System.out.println(response.getStatusLine());
        System.out.println(response.getHeader("content-type"));
        System.out.println(response.getTime());

        assertEquals(response.getStatusCode(), 200);

    }
    */

    @Test
    void test_local(){
        baseURI = "https://localhost:8080";
        given().get("/employees").then().assertThat().statusCode(200);
    }
}