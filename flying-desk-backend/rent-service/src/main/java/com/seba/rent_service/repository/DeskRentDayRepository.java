package com.seba.rent_service.repository;

import com.seba.rent_service.model.DeskRentDay;
import com.seba.rent_service.model.DayOfWeekEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeskRentDayRepository extends JpaRepository<DeskRentDay, Long> {
    List<DeskRentDay> findByDeskRentOptionId(Long deskRentOptionId);
    List<DeskRentDay> findByDayOfWeek(DayOfWeekEnum dayOfWeek);
}
