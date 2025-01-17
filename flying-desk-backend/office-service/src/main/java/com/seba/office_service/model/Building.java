package com.seba.office_service.model;

import com.seba.office_service.dto.PhotoDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "building", nullable = false)
    @NotBlank(message = "Building name is mandatory")
    private String building;

    @Column(name = "description")
    @NotBlank(message = "Building description is mandatory")
    private String description;

    @ManyToOne
    @JoinColumn(name = "address_id")
    @NotNull(message = "Address id is mandatory")
    private Address address;

    @NotNull(message = "User ID is required")
    @Column(nullable = false)
    private Long userId;

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
    private Status status = Status.ACTIVE;

    public enum Status {
        ACTIVE, INACTIVE, UNDER_REVIEW
    }

    @Transient // Pole nie zapisuje się w bazie
    private List<PhotoDTO> photos;
}