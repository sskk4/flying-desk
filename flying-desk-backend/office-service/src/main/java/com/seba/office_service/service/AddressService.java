package com.seba.office_service.service;

import com.seba.office_service.dto.AddressDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.model.City;
import com.seba.office_service.model.Country;
import com.seba.office_service.repository.AddressRepository;
import com.seba.office_service.model.Address;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;
    private final CountryService countryService;
    private final CityService cityService;

    public Address getAddressById(Long id) {
        log.info("Fetching address with id: {}", id);
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id " + id));
    }

    public Address saveAddress(Long id, AddressDTO addressDTO) {
        City city = cityService.getCityById(addressDTO.getCityId());
        Country country = countryService.getCountryById(addressDTO.getCountryId());

        Address address = (id != null) ? getAddressById(id) : new Address();
        address.setCity(city);
        address.setCountry(country);

        // Budowanie adresu na podstawie Street, Building Number i Zip Code
        String fullAddress = String.join(", ",
                StringUtils.hasText(addressDTO.getStreet()) ? addressDTO.getStreet() : "",
                StringUtils.hasText(addressDTO.getBuildingNumber()) ? addressDTO.getBuildingNumber() : "",
                StringUtils.hasText(addressDTO.getZipCode()) ? addressDTO.getZipCode() : ""
        ).trim();

        address.setAddress(fullAddress);
        return addressRepository.save(address);
    }

    public void deleteAddress(Long id) {
        log.info("Deleting address with id: {}", id);
        Address address = getAddressById(id);
        addressRepository.delete(address);
    }
}

