package com.seba.office_spaces.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "building", nullable = false)
    private String building;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
}