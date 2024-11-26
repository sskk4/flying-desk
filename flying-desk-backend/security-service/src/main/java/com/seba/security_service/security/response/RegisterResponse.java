package com.seba.security_service.security.response;

import com.seba.security_service.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {

        private String firstname;
        private String lastname;
        private String email;
        private boolean isActive;
        private Role role;
}
