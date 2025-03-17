package com.seba.rent_service.repository;

import com.seba.rent_service.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {

    /**
     * Pobiera płatność po ID.
     */
    Optional<Payment> findById(Long id);

    /**
     * Pobiera wszystkie płatności użytkownika.
     */
    List<Payment> findAllByUserId(Long userId);

    /**
     * Pobiera wszystkie płatności (dla administratora).
     */
    List<Payment> findAll();
}
