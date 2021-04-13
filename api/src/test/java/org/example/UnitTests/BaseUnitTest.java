package org.example.UnitTests;

import org.junit.Before;
import org.junit.jupiter.api.Tag;
import org.mockito.MockitoAnnotations;

import org.junit.After;

@Tag("unit")
public class BaseUnitTest {
    private AutoCloseable closeable;

    @Before
    public void setup() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @After
    public void releaseMocks() throws Exception {
        closeable.close();
    }

}
