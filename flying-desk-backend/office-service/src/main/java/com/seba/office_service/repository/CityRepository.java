package com.seba.office_service.repository;

import com.seba.office_service.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
}
