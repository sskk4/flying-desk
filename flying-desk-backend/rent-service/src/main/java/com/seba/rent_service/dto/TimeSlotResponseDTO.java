package com.seba.rent_service.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TimeSlotResponseDTO {
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
}
