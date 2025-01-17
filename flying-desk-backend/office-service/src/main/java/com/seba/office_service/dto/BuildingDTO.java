package com.seba.office_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuildingDTO {

    @NotBlank(message = "Building name is required")
    private String building;

    @NotNull(message = "Address is required")
    private AddressDTO address;

    @NotBlank(message = "Building description is required")
    private String description;
}