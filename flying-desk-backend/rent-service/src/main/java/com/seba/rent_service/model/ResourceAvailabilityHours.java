package com.seba.rent_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "resource_availability_hours")
public class ResourceAvailabilityHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "availability_day_id", nullable = false)
    private ResourceAvailabilityDay availabilityDay;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    // Optional: you can add additional properties like specific capacity for this time slot
    // @Column(name = "capacity")
    // private Integer capacity;
}