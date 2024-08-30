package com.seba.office_spaces.repository;

import com.seba.office_spaces.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
}
