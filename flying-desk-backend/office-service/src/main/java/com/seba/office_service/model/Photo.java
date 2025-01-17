package com.seba.office_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url; // URL zdjęcia (np. z chmury)

    @Column(nullable = false)
    private String photoType; // Typ obiektu: BUILDING, ROOM, DESK, SUBMISSION, itp.

    @Column(nullable = false)
    private Long relatedId; // ID obiektu powiązanego (np. ID budynku, ID zgłoszenia)

    // Metody pomagające powiązać zdjęcie z danym obiektem
    public boolean isBuildingPhoto() {
        return "BUILDING".equals(photoType);
    }

    public boolean isSubmissionPhoto() {
        return "SUBMISSION".equals(photoType);
    }

    public boolean isRoomPhoto() {
        return "ROOM".equals(photoType);
    }

    public boolean isDeskPhoto() {
        return "DESK".equals(photoType);
    }
}