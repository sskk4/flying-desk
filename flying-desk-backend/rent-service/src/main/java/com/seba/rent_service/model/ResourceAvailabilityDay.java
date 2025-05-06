package com.seba.rent_service.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "resource_availability_days")
public class ResourceAvailabilityDay {

    public enum DayOfWeekEnum { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "availability_id", nullable = false)
    private ResourceAvailability availability;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeekEnum dayOfWeek;

    @OneToMany(mappedBy = "availabilityDay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResourceAvailabilityHours> availabilityHours;
}