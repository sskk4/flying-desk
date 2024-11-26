package com.seba.security_service.email;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordRecoveryRequest{

    private String password;
}