package org.example.http.error;

// import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class ApiError {

    // private LocalDateTime localDateTime;
    private HttpStatus status;
    private String message;
    private List<String> errors;
    

    public ApiError() {
        super();
        // this.localDateTime = LocalDateTime.now();
    }

    public ApiError(final HttpStatus status, final String message, final List<String> errors) {
        super();
        // this.localDateTime = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.errors = errors;
        
    }

    public ApiError(final HttpStatus status, final String message, final String error) {
        super();
        // this.localDateTime = LocalDateTime.now();
        this.status = status;
        this.message = message;
        errors = Arrays.asList(error);
        
    }

}