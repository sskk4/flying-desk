package com.seba.rent_service.service;

import com.seba.rent_service.dto.CreateReservationCodeRequest;
import com.seba.rent_service.dto.ReservationCodeResponse;
import com.seba.rent_service.mapper.ReservationCodeMapper;
import com.seba.rent_service.model.ReservationCode;
import com.seba.rent_service.repository.ReservationCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservationCodeService {

    private final ReservationCodeRepository repository;
    private final ReservationCodeMapper mapper;

    @Transactional
    public ReservationCodeResponse createReservationCode(CreateReservationCodeRequest request) {
        ReservationCode reservationCode = mapper.toEntity(request);
        ReservationCode savedReservationCode = repository.save(reservationCode);
        return mapper.toResponse(savedReservationCode);
    }

    public Optional<ReservationCodeResponse> getReservationCode(String code) {
        return repository.findByCode(code)
                .map(mapper::toResponse);
    }

    public Optional<ReservationCodeResponse> getReservationCodeByRentId(Long rentId) {
        return repository.findByRentId(rentId)
                .map(mapper::toResponse);
    }

    @Transactional
    public void markAsUsed(String code) {
        repository.findByCode(code).ifPresent(reservationCode -> {
            reservationCode.setUsed(true);
            repository.save(reservationCode);
        });
    }
}
