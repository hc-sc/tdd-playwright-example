package org.example.http.util;

import org.example.http.error.EntityNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.NoSuchElementException;

/**
 * Simple static methods to be called at the start of your own methods to verify
 * correct arguments and state. If the Precondition fails, an {@link HttpStatus}
 * code is thrown
 */
public final class RestPreconditions {

    private RestPreconditions() {
        throw new AssertionError();
    }

    // API

    /**
     * Check if some value was found, otherwise throw exception.
     * 
     * @param expression has value true if found, otherwise false
     * @throws EntityNotFoundException if expression is false, means value not
     *                                 found.
     */
    public static boolean checkFound(final boolean expression) {
        if (!expression) {
            throw new EntityNotFoundException(HttpStatus.NOT_FOUND, "Employee Not Found");
        }
        return expression;
    }

    /**
     * Check if some value was found, otherwise throw exception.
     * 
     * @param expression has value true if found, otherwise false
     * @throws EntityNotFoundException if expression is false, means value not
     *                                 found.
     */
    public static <T> T checkFound(final T resource) {
        if (resource == null || resource.equals(null)) {
            throw new EntityNotFoundException(HttpStatus.NOT_FOUND, "Employee Not Found");
        }
        return resource;
    }

}