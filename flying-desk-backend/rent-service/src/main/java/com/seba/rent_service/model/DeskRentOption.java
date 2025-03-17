package com.seba.rent_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "desk_rent_options")
public class DeskRentOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "desk_id", nullable = false)
    private Long deskId;

    @Column(name = "available_from", nullable = false)
    private LocalDate availableFrom;

    @Column(name = "available_to", nullable = false)
    private LocalDate availableTo;

    @OneToMany(mappedBy = "deskRentOption", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeskRentDay> availableDays;
}
