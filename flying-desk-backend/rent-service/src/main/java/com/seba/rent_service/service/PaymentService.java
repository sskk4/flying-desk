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

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public Payment getByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    public Payment getByRentId(Long rentId) {
        return paymentRepository.findByRentId(rentId).get(0);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
