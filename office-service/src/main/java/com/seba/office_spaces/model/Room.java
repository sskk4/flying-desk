package com.seba.office_spaces.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipment", nullable = false)
    @Enumerated(EnumType.STRING)
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;

    public enum Equipment {
        Desk, Projector, MultimediaBoard

        //todo: uzupełnić
    }
}
