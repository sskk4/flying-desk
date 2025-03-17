package com.seba.rent_service.service;

import com.seba.rent_service.model.Payment;
import com.seba.rent_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    /**
     * Tworzy nową płatność.
     */
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    /**
     * Pobiera płatność po ID.
     */
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    /**
     * Pobiera wszystkie płatności użytkownika.
     */
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findAllByUserId(userId);
    }

    /**
     * Pobiera wszystkie płatności (dla administratora).
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
