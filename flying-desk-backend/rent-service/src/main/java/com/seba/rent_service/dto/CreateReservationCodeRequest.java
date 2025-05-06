package com.seba.rent_service.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class CreateReservationCodeRequest {

    @NotBlank
    private String code;

    @NotNull
    private Long rentId;

    @NotNull
    private Long paymentId;

    @NotNull
    private Long userId;

    @NotNull
    private LocalDateTime expiresAt;
}