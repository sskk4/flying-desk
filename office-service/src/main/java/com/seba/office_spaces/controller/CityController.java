package com.seba.office_spaces.controller;

import com.seba.office_spaces.model.City;
import com.seba.office_spaces.dto.CityDTO;
import com.seba.office_spaces.service.CityService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/city")
public class CityController {

    private final String TAG = "CityController - ";

    private final CityService cityService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public City getCityById(@PathVariable Long id) {
        log.info(TAG + "Get city by id: {}", id);
        return cityService.getCityById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public City createCity(@RequestBody CityDTO city) {
        log.info(TAG + "Create new city: {}", city.getCity());
        return cityService.createCity(city);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public City updateCity(@PathVariable Long id,
                           @RequestBody CityDTO cityDetails) {
        log.info(TAG + "Update city with id: {}", id);
        return cityService.updateCity(id, cityDetails);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCity(@PathVariable Long id) {
        log.info(TAG + "Delete city with id: {}", id);
        cityService.deleteCity(id);
    }
}
