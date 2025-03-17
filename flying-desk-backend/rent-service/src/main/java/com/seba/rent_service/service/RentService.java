package com.seba.rent_service.service;

import com.seba.rent_service.model.Rent;
import com.seba.rent_service.repository.RentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RentService {

    private final RentRepository rentRepository;

    /**
     * Tworzy nowy wynajem.
     */
    public Rent createRent(Rent rent) {
        return rentRepository.save(rent);
    }

    /**
     * Pobiera wynajem po ID.
     */
    public Optional<Rent> getRentById(Long id) {
        return rentRepository.findById(id);
    }

    /**
     * Pobiera wszystkie wynajmy użytkownika.
     */
    public List<Rent> getRentsByUserId(Long userId) {
        return rentRepository.findAllByUserId(userId);
    }

    /**
     * Pobiera wszystkie wynajmy (dla administratora).
     */
    public List<Rent> getAllRents() {
        return rentRepository.findAll();
    }
}
