package com.seba.security_service.exception.error;

public class UserFailedAuthentication extends RuntimeException {

    public UserFailedAuthentication(final String message) {
        super(message);
    }
}
