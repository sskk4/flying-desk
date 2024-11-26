package com.seba.security_service.security.request;

import com.seba.security_service.model.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SetRoleRequest {
    @NotNull
    private Role role;
}
