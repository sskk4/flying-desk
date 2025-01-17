package com.seba.office_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO dla klasy Room, reprezentujący szczegóły pokoju w formie zewnętrznej do użycia np. w kontrolerach.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO {

    @NotBlank(message = "Room name is required")
    private String room;

    @NotBlank(message = "Equipment is required (e.g., DESK, PROJECTOR, etc.)")
    private String equipment;

    @NotBlank(message = "Room description is required")
    private String description;

    @Positive(message = "Max occupants must be a positive number")
    private Integer maxOccupants;

    @Positive(message = "Price must be a positive number")
    private Double price;

    @NotBlank(message = "Status is required (e.g., AVAILABLE, BOOKED, OUT_OF_SERVICE)")
    private String status;
}