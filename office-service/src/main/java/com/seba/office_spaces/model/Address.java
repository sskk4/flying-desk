package com.seba.office_spaces.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Address is mandatory")
    private String address;

    @ManyToOne
    @JoinColumn(name = "city_id")
    @NotNull(message="City id is mandatory")
    private City city;

    @ManyToOne
    @JoinColumn(name = "country_id")
    @NotNull(message="Country id is mandatory")
    private Country country;

}
