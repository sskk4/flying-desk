package com.seba.office_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {

    @NotBlank(message = "Street is mandatory")
    private String street;

    @NotBlank(message = "Building number is mandatory")
    private String buildingNumber;

    @NotBlank(message = "Zip Code is mandatory")
    private String zipCode;

    @NotNull(message = "City ID is mandatory")
    private Long cityId;

    @NotNull(message = "Country ID is mandatory")
    private Long countryId;
}
