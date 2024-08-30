package com.seba.office_spaces.repository;

import com.seba.office_spaces.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Long> {
}
