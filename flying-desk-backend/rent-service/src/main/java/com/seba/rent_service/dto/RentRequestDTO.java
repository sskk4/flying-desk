package com.seba.rent_service.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RentRequestDTO {
    @NotNull
    private Long userId;

    @NotNull
    private String resourceType;

    @NotNull
    private Long resourceId;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    @NotNull
    private BigDecimal price;

    @AssertTrue(message = "Start date must be before end date")
    public boolean isStartBeforeEnd() {
        return startDate != null && endDate != null && startDate.isBefore(endDate);
    }
}

