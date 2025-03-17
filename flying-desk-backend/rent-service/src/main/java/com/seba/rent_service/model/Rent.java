package com.seba.rent_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "rents")
public class Rent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "office_id")
    private Long officeId;

    @Column(name = "desk_id")
    private Long deskId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "rent_type", nullable = false)
    private RentType rentType;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @NotNull
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RentStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum RentType {
        ROOM, DESK
    }

    public enum RentStatus {
        PENDING, PAID, CANCELLED
    }
}
