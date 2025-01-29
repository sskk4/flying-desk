package com.seba.office_service.model;

import com.seba.office_service.dto.PhotoDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Desk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "desk", nullable = false)
    @NotBlank(message = "Desk name is mandatory")
    private String desk;

    @Column(name = "equipment", nullable = false)
    private String equipment;

    @ManyToOne
    @JoinColumn(name = "building_id")
    @NotNull(message = "Building id is mandatory")
    private Building building;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Double price;

    @CreationTimestamp
    @Column(name = "creation_date", updatable = false, nullable = false)
    private LocalDateTime creationDate;

    @UpdateTimestamp
    @Column(name = "edit_date", nullable = false)
    private LocalDateTime editDate;

    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AVAILABLE;

    public enum Status {
       AVAILABLE, BOOKED, OUT_OF_SERVICE
    }

    @Transient // Pole nie zapisuje się w bazie
    private List<PhotoDTO> photos;
}