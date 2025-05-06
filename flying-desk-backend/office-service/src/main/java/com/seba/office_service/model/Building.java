package com.seba.office_service.model;

import com.seba.office_service.dto.PhotoDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Building name is mandatory")
    private String building;

    @Column(nullable = false)
    @NotBlank(message = "Building description is mandatory")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "building_type")
    private BuildingType buildingType;

    public enum BuildingType {
        OFFICE, COWORKING, WAREHOUSE, OTHER
    }

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "has_elevator")
    private Boolean hasElevator = false;

    @Column(name = "has_parking")
    private Boolean hasParking = false;

    @Column(name = "contact_email")
    @Email
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "rating", precision = 2, scale = 1)
    private BigDecimal rating;

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

    @Transient
    private List<PhotoDTO> photos;
}
