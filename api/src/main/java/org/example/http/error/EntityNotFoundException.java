package org.example.http.error;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.Setter;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Entity Not Found")
public final class EntityNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    public static final String MSG_KEY_ENTITY_NOT_FOUND = "entityNotFound";

    @Getter
    @Setter
    private HttpStatus status;

    @Getter
    @Setter
    private String message;

    @Getter
    @Setter
    private Throwable cause;

    public EntityNotFoundException() {
        super();
    }

    public EntityNotFoundException(final String message, final Throwable cause) {
        super(message, cause); // does not set?
        this.setMessage(message);
    }

    public EntityNotFoundException(final String message) {
        super(message); // does not set?
        this.setMessage(message);
    }

    public EntityNotFoundException(HttpStatus status, final String message) {
        super(message); // does not set?
        this.setStatus(status);
        this.setMessage(message);
    }

    public EntityNotFoundException(final Throwable cause) {
        super(cause);
    }

}
