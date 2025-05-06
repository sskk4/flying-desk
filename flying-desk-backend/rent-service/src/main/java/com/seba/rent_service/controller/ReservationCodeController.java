package com.seba.rent_service.controller;

import com.seba.rent_service.dto.CreateReservationCodeRequest;
import com.seba.rent_service.dto.ReservationCodeResponse;
import com.seba.rent_service.model.ReservationCode;
import com.seba.rent_service.service.ReservationCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reservation-codes")
@RequiredArgsConstructor
public class ReservationCodeController {

    private final ReservationCodeService service;

    @PostMapping
    public ResponseEntity<ReservationCodeResponse> createReservationCode(
            @RequestBody @Valid CreateReservationCodeRequest request) {
        ReservationCodeResponse response = service.createReservationCode(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<ReservationCodeResponse> getReservationCode(@PathVariable String code) {
        return service.getReservationCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/rent/{rentId}")
    public ResponseEntity<ReservationCodeResponse> getReservationCodeByRentId(@PathVariable Long rentId) {
        return service.getReservationCodeByRentId(rentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{code}/use")
    public ResponseEntity<Void> markCodeAsUsed(@PathVariable String code) {
        service.markAsUsed(code);
        return ResponseEntity.noContent().build();
    }
}