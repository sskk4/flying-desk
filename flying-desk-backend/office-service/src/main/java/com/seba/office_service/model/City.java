package com.seba.office_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "City name is mandatory")
    private String city;

    @ManyToOne
    @JoinColumn(name = "country_id")
    @NotNull(message = "Country id is mandatory")
    private Country country;

}