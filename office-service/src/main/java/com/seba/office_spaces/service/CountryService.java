package com.seba.office_spaces.service;

import com.seba.office_spaces.model.Country;
import com.seba.office_spaces.exception.errors.ResourceNotFoundException;
import com.seba.office_spaces.repository.CountryRepository;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class CountryService {

    private final CountryRepository countryRepository;

    @SneakyThrows
    public Country getCountryById(Long id) {
        return countryRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Country not found with id: " + id));
    }

    @SneakyThrows
    public Country createCountry(Country country) {
        return countryRepository.save(country);
    }

    @SneakyThrows
    public Country updateCountry(Long id, Country countryDetails) {
        Country country = getCountryById(id);
        country.setCountry(countryDetails.getCountry());
        return countryRepository.save(country);
    }

    @SneakyThrows
    public void deleteCountry(Long id) {
        Country country = getCountryById(id);
        countryRepository.delete(country);
    }
}
