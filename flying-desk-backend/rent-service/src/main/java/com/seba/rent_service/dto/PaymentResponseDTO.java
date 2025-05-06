package com.seba.rent_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Long id;
    private Long rentId;
    private Long userId;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private String transactionId;
    private LocalDateTime createdAt;
}