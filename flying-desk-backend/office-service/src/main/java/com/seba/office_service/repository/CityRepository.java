package com.seba.office_service.repository;

import com.seba.office_service.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findAllByCountry_Id(Long countryId);
}
