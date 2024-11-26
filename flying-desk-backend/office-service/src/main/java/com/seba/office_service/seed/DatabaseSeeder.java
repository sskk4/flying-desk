package com.seba.office_service.seed;

import com.seba.office_service.dto.AddressDTO;
import com.seba.office_service.dto.BuildingDTO;
import com.seba.office_service.dto.CityDTO;
import com.seba.office_service.model.Country;
import com.seba.office_service.model.Building;
import com.seba.office_service.service.AddressService;
import com.seba.office_service.service.BuildingService;
import com.seba.office_service.service.CityService;
import com.seba.office_service.service.CountryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final CountryService countryService;
    private final CityService cityService;
    private final AddressService addressService;
    private final BuildingService buildingService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Seeding database...");

        // 1. Dodaj kraje
        var poland = countryService.saveCountry(new Country(null, "Poland"));
        var germany = countryService.saveCountry(new Country(null, "Germany"));

        // 2. Dodaj miasta
        var warsaw = cityService.saveCity(new CityDTO("Warsaw", poland.getId()));
        var berlin = cityService.saveCity(new CityDTO("Berlin", germany.getId()));

        // 3. Dodaj adresy
        var address1 = addressService.saveAddress(null, new AddressDTO("Main Street 1", warsaw.getId(), poland.getId()));
        var address2 = addressService.saveAddress(null, new AddressDTO("Hauptstraße 5", berlin.getId(), germany.getId()));


        log.info("Database seeding completed.");
    }
}
