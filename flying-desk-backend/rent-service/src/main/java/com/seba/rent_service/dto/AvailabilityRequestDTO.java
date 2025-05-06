package com.seba.rent_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AvailabilityRequestDTO {
    private String resourceType;
    private Long resourceId;
    private LocalDate availableFrom;
    private LocalDate availableTo;
    private List<DayWithHoursDTO> availableDaysWithHours;
}
