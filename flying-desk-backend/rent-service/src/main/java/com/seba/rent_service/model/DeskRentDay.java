package com.seba.rent_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "desk_rent_days")
public class DeskRentDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "desk_rent_option_id", nullable = false)
    private DeskRentOption deskRentOption;

    @Column(name = "day_of_week", nullable = false)
    @Enumerated(EnumType.STRING)
    private DayOfWeekEnum dayOfWeek;
}
