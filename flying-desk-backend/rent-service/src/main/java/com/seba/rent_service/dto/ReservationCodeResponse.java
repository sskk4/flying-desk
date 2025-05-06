package com.seba.rent_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationCodeResponse {

    private Long id;
    private String code;
    private Long rentId;
    private Long paymentId;
    private Long userId;
    private LocalDateTime expiresAt;
    private Boolean used;
    private LocalDateTime createdAt;
}