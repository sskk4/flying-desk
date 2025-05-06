package com.seba.rent_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Column(name = "rent_id", nullable = false)
    private Long rentId;

    @Column(name = "payment_id", nullable = false)
    private Long paymentId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean used = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}