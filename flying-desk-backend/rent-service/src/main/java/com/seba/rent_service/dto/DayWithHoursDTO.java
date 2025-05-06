package com.seba.rent_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class DayWithHoursDTO {
    private String dayOfWeek;
    private List<TimeSlotDTO> timeSlots;
}
