package com.seba.office_service.service;

import com.seba.office_service.dto.CityDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.repository.CityRepository;
import com.seba.office_service.model.City;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class CityService {

    private final CityRepository cityRepository;
    private final CountryService countryService;

    public City getCityById(Long id) {
        log.info("Fetching city with id: {}", id);
        return cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + id));
    }

    public City saveCity(CityDTO cityDTO) {
        log.info("Saving city: {}", cityDTO.getCity());

        var country = countryService.getCountryById(cityDTO.getCountryId());

        City city = new City();
        city.setCountry(country);
        city.setCity(cityDTO.getCity());

        return cityRepository.save(city);
    }

    public void deleteCity(Long id) {
        log.info("Deleting city with id: {}", id);
        City city = getCityById(id);
        cityRepository.delete(city);
    }
}
