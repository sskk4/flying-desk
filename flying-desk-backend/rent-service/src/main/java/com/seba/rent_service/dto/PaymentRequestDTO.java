package com.seba.rent_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequestDTO {
    private Long rentId;
    private Long userId;
    private BigDecimal amount;
    private String paymentMethod;
    private String transactionId;
}
