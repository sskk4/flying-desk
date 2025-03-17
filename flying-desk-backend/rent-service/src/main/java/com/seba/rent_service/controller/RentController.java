package com.seba.rent_service.controller;

import com.seba.rent_service.model.Rent;
import com.seba.rent_service.service.RentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rent")
public class RentController {

    private final RentService rentService;

    /**
     * Tworzy nowy wynajem.
     */
    @PostMapping
    public ResponseEntity<Rent> createRent(@RequestBody Rent rent) {
        Rent savedRent = rentService.createRent(rent);
        return ResponseEntity.ok(savedRent);
    }

    /**
     * Pobiera wynajem po ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Rent> getRentById(@PathVariable Long id) {
        Optional<Rent> rent = rentService.getRentById(id);
        return rent.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Pobiera wszystkie wynajmy dla konkretnego użytkownika.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rent>> getRentsByUserId(@PathVariable Long userId) {
        List<Rent> rents = rentService.getRentsByUserId(userId);
        return ResponseEntity.ok(rents);
    }

    /**
     * Pobiera wszystkie wynajmy (dla administratora).
     */
    @GetMapping
    public ResponseEntity<List<Rent>> getAllRents() {
        List<Rent> rents = rentService.getAllRents();
        return ResponseEntity.ok(rents);
    }
}
