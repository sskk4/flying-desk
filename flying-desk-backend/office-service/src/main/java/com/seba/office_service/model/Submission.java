package com.seba.office_service.model;

import com.seba.office_service.dto.PhotoDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User ID is required")
    @Column(nullable = false)
    private Long userId;

    @NotBlank(message = "First name is required")
    @Column(nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(nullable = false, length = 50)
    private String lastName;

    @NotBlank(message = "Phone number is required")
    @Column(nullable = false, length = 20)
    @Pattern(regexp = "^\\+?[0-9\\- ]{7,15}$", message = "Invalid phone number")
    private String phone;

    @Email(message = "Valid email is required")
    @Column(nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Country is required")
    @Column(nullable = false, length = 50)
    private String country;

    @NotBlank(message = "Address is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @NotBlank(message = "Building name is required")
    @Column(nullable = false, length = 100)
    private String buildingName;

    @NotBlank(message = "Building description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String buildingDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    @Transient // Pole nie zapisuje się w bazie
    private List<PhotoDTO> photos;
}
