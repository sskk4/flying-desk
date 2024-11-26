package com.seba.office_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Desk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipment", nullable = false)
    @Enumerated(EnumType.STRING)
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "room_id")
    @NotNull(message = "Room id is mandatory")
    private Room room;

    public enum Equipment {
        Monitor

        //todo: uzupełnić i stworzyć taki widok formularza że można sobie wybierać
    }
}
