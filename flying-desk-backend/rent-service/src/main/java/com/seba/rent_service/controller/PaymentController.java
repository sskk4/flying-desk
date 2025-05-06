package com.seba.rent_service.controller;

import com.seba.rent_service.model.Payment;
import com.seba.rent_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payment")
public class PaymentController {


    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.createPayment(payment));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransactionId(@PathVariable String transactionId) {
        return ResponseEntity.ok(paymentService.getByTransactionId(transactionId));
    }
}
