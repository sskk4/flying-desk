package com.seba.office_service.controller;

import com.seba.office_service.dto.CityDTO;
import com.seba.office_service.model.City;
import com.seba.office_service.repository.CityRepository;
import com.seba.office_service.service.CityService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/city")
public class CityController {

    private final String TAG = "CityController - ";

    private final CityService cityService;
    private final CityRepository cityRepository;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public City getCityById(@PathVariable Long id) {
        log.info(TAG + "Get city by id: {}", id);
        return cityService.getCityById(id);
    }

    @GetMapping("/by-country/{countryId}")
    @ResponseStatus(HttpStatus.OK)
    public List<City> getCitiesByCountry(@PathVariable Long countryId) {
        return cityRepository.findAllByCountry_Id(countryId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public City createCity(@RequestBody CityDTO city) {
        log.info(TAG + "Create new city: {}", city.getCity());
        return cityService.saveCity(city);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCity(@PathVariable Long id) {
        log.info(TAG + "Delete city with id: {}", id);
        cityService.deleteCity(id);
    }
}
