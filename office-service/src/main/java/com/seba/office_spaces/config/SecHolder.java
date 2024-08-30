package com.seba.office_spaces.config;

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