package com.seba.office_service.exception.errors;

public class UserFailedAuthentication extends RuntimeException{
    public UserFailedAuthentication( final String message) {
        super(message);
    }
}