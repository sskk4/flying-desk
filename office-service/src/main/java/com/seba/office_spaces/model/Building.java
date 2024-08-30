package com.seba.office_spaces.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "building", nullable = false)
    @NotBlank(message="Building name is mandatory")
    private String building;

    @Column(name = "description")
    @NotBlank(message="Building description is mandatory")
    private String description;

    @ManyToOne
    @JoinColumn(name = "address_id")
    @NotNull(message="Address id is mandatory")
    private Address address;
}