package com.seba.office_service.service;

import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.repository.CountryRepository;
import com.seba.office_service.model.Country;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class CountryService {

    private final CountryRepository countryRepository;

    public Country getCountryById(Long id) {
        log.info("Fetching country with id: {}", id);
        return countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country not found with id: " + id));
    }

    public Country saveCountry(Country countryDetails) {
        log.info("Saving country: {}", countryDetails.getCountry());
        return countryRepository.save(countryDetails);
    }

    public void deleteCountry(Long id) {
        log.info("Deleting country with id: {}", id);
        Country country = getCountryById(id);
        countryRepository.delete(country);
    }
}

