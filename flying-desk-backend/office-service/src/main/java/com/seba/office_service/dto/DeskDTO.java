package com.seba.office_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO dla klasy Desk, reprezentujący szczegóły biurka w formie do użycia np. w kontrolerach.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeskDTO {

    @NotBlank(message = "Desk name is required")
    private String desk;

    @NotBlank(message = "Equipment type is required (e.g., MONITOR, COMPUTER, etc.)")
    private String equipment;

    @NotBlank(message = "Desk description is required")
    private String description;

    @Positive(message = "Price must be a positive number")
    private Double price;

    @NotBlank(message = "Status is required (e.g., AVAILABLE, BOOKED, OUT_OF_SERVICE)")
    private String status;
}