package com.seba.rent_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class DayWithHoursResponseDTO {
    private String dayOfWeek;
    private Long dayId;
    private List<TimeSlotResponseDTO> timeSlots;
}