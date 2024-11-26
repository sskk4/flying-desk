package com.seba.security_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.UUID;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refresh_token")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;

    @Column(nullable = false, unique = true)
    public UUID token;

    @CreatedDate
    public LocalDateTime created;

    @LastModifiedDate
    public LocalDateTime expired;

    @OneToOne(fetch = FetchType.EAGER) @JoinColumn(name = "user_id")
    public User user;
}
