package com.seba.rent_service.repository;

import com.seba.rent_service.model.ReservationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservationCodeRepository extends JpaRepository<ReservationCode, Long> {
    Optional<ReservationCode> findByCode(String code);
    Optional<ReservationCode> findByRentId(Long rentId);
}