package com.seba.security_service.util;

import com.seba.security_service.security.CustomPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityHolder {

    public static CustomPrincipal getPrincipal() {
        return ((CustomPrincipal)
                (SecurityContextHolder.getContext().getAuthentication())
                        .getPrincipal());
    }
}
