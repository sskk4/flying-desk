package com.seba.office_spaces.exception.errors;

public class UserFailedAuthentication extends RuntimeException{
    public UserFailedAuthentication( final String message) {
        super(message);
    }
}