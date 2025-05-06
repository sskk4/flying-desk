package com.seba.rent_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AvailabilityResponseDTO {
    private Long id;
    private String resourceType;
    private Long resourceId;
    private LocalDate availableFrom;
    private LocalDate availableTo;
    private List<DayWithHoursResponseDTO> availableDaysWithHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}