package com.seba.office_spaces.config;

import io.jsonwebtoken.Claims;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.security.Principal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CustomPrincipal implements Principal {

    private Long id;
    private String name;

    @Override
    public String getName() {
        return name;
    }


    public CustomPrincipal(Claims claims) {
        this.id = ((Integer) claims.get("user_id")).longValue();
        this.name = (String) claims.get("sub");
    }

}