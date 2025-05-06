package com.seba.rent_service.repository;

import com.seba.rent_service.model.ResourceAvailabilityDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceAvailabilityDayRepository extends JpaRepository<ResourceAvailabilityDay, Long> {
    List<ResourceAvailabilityDay> findByAvailabilityId(Long availabilityId);
}