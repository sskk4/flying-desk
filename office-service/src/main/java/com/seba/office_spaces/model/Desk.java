package com.seba.office_spaces.model;

import jakarta.persistence.*;
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
    private Room room;

    public enum Equipment {
        Monitor

        //todo: uzupełnić i stworzyć taki widok formularza że można sobie wybierać
    }
}
