package org.example.UnitTests;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.jupiter.api.Tag;
import org.mockito.MockitoAnnotations;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.After;
import org.junit.AfterClass;

@Tag("unit")
public class BaseUnitTest {
    private AutoCloseable closeable;

    @Before
    public void setup() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    // @AfterClass
    // public static void close() {
    // factory.close();
    // }

    @After
    public void releaseMocks() throws Exception {
        closeable.close();
    }

}
