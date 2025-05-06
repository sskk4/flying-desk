package com.seba.rent_service.mapper;

import com.seba.rent_service.dto.CreateReservationCodeRequest;
import com.seba.rent_service.dto.ReservationCodeResponse;
import com.seba.rent_service.model.ReservationCode;
import org.springframework.stereotype.Component;

@Component
public class ReservationCodeMapper {

    public ReservationCode toEntity(CreateReservationCodeRequest request) {
        return ReservationCode.builder()
                .code(request.getCode())
                .rentId(request.getRentId())
                .paymentId(request.getPaymentId())
                .userId(request.getUserId())
                .expiresAt(request.getExpiresAt())
                .used(false)
                .build();
    }

    public ReservationCodeResponse toResponse(ReservationCode reservationCode) {
        ReservationCodeResponse response = new ReservationCodeResponse();
        response.setId(reservationCode.getId());
        response.setCode(reservationCode.getCode());
        response.setRentId(reservationCode.getRentId());
        response.setPaymentId(reservationCode.getPaymentId());
        response.setUserId(reservationCode.getUserId());
        response.setExpiresAt(reservationCode.getExpiresAt());
        response.setUsed(reservationCode.getUsed());
        response.setCreatedAt(reservationCode.getCreatedAt());
        return response;
    }
}
