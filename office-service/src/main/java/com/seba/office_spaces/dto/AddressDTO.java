package com.seba.office_spaces.dto;

import lombok.Data;

@Data
public class AddressDTO {

    private String address;
    private Long cityId;
    private Long countryId;
}

