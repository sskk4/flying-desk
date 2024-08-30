package com.seba.office_spaces.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

}