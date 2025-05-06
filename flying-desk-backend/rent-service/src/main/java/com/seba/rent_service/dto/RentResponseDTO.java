package com.seba.rent_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RentResponseDTO {
    private Long id;
    private Long userId;
    private String resourceType;
    private Long resourceId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal price;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
