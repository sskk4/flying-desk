package com.seba.rent_service.config;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecHolder {

    public static CustomPrincipal getPrincipal() {
        return ((CustomPrincipal)
                (SecurityContextHolder.getContext().getAuthentication())
                        .getPrincipal());
    }

    public static Long getUserId() {
        return ((CustomPrincipal)
                (SecurityContextHolder.getContext().getAuthentication())
                        .getPrincipal()).getId();
    }
}