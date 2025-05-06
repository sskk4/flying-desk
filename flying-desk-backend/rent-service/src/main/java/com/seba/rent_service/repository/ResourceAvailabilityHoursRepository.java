package com.seba.rent_service.repository;

import com.seba.rent_service.model.ResourceAvailabilityHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceAvailabilityHoursRepository extends JpaRepository<ResourceAvailabilityHours, Long> {
    List<ResourceAvailabilityHours> findByAvailabilityDayId(Long availabilityDayId);
}