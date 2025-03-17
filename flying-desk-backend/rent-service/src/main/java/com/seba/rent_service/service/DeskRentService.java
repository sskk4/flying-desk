package com.seba.rent_service.service;

import com.seba.rent_service.model.DeskRentOption;
import com.seba.rent_service.model.DeskRentDay;
import com.seba.rent_service.model.DayOfWeekEnum;
import com.seba.rent_service.repository.DeskRentOptionRepository;
import com.seba.rent_service.repository.DeskRentDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeskRentService {

    private final DeskRentOptionRepository deskRentOptionRepository;
    private final DeskRentDayRepository deskRentDayRepository;

    public DeskRentOption createDeskRentOption(DeskRentOption option) {
        return deskRentOptionRepository.save(option);
    }

    public List<DeskRentOption> getAllDeskRentOptions() {
        return deskRentOptionRepository.findAll();
    }

    public Optional<DeskRentOption> getDeskRentOptionById(Long id) {
        return deskRentOptionRepository.findById(id);
    }

    public List<DeskRentOption> getDeskRentOptionsByDeskId(Long deskId) {
        return deskRentOptionRepository.findByDeskId(deskId);
    }

    public List<DeskRentDay> getDeskRentDaysByOptionId(Long optionId) {
        return deskRentDayRepository.findByDeskRentOptionId(optionId);
    }

    public List<DeskRentDay> getDeskRentDaysByDayOfWeek(DayOfWeekEnum dayOfWeek) {
        return deskRentDayRepository.findByDayOfWeek(dayOfWeek);
    }
}
