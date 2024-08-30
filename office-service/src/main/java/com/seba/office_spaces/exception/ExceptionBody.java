package com.seba.office_spaces.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExceptionBody {

    private Integer code;
    private String message;

    public ExceptionBody(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}