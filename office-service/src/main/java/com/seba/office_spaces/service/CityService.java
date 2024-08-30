package com.seba.office_spaces.service;

import com.seba.office_spaces.dto.CityDTO;
import com.seba.office_spaces.model.City;
import com.seba.office_spaces.exception.errors.ResourceNotFoundException;
import com.seba.office_spaces.model.Country;
import com.seba.office_spaces.repository.CityRepository;
import com.seba.office_spaces.repository.CountryRepository;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    private final CountryService countryService;

    @SneakyThrows
    public City getCityById(Long id) {
        return cityRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("City not found with id: " + id));
    }

    @SneakyThrows
    public City createCity(CityDTO cityDTO) {

        var country = countryService.getCountryById(cityDTO.getCountryId());

        City city = new City();
        city.setCountry(country);
        city.setCity(cityDTO.getCity());

        return cityRepository.save(city);
    }

    @SneakyThrows
    public City updateCity(Long id, CityDTO cityDetails) {

        var country = countryService.getCountryById(cityDetails.getCountryId());

        City city = getCityById(id);
        city.setCity(cityDetails.getCity());
        city.setCountry(country);
        return cityRepository.save(city);
    }

    @SneakyThrows
    public void deleteCity(Long id) {
        City city = getCityById(id);
        cityRepository.delete(city);
    }
}
