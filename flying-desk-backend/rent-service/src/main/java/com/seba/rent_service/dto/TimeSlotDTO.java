package com.seba.rent_service.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TimeSlotDTO {
    private LocalTime startTime;
    private LocalTime endTime;
}
