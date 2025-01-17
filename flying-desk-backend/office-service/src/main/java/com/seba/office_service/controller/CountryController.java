package com.seba.office_service.controller;

import com.seba.office_service.model.Country;
import com.seba.office_service.repository.CountryRepository;
import com.seba.office_service.service.CountryService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/country")
public class CountryController {

    private final String TAG = "CountryController - ";

    private final CountryService countryService;
    private final CountryRepository countryRepository;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Country getCountryById(@PathVariable Long id) {
        log.info(TAG + "Get country by id: {}", id);
        return countryService.getCountryById(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Country saveCountry(@RequestBody Country country) {
        log.info(TAG + "Create new country: {}", country.getCountry());
        return countryService.saveCountry(country);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCountry(@PathVariable Long id) {
        log.info(TAG + "Delete country with id: {}", id);
        countryService.deleteCountry(id);
    }
}
