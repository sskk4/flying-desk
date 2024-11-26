package com.seba.office_service.service;

import com.seba.office_service.dto.AddressDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.repository.AddressRepository;
import com.seba.office_service.model.Address;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
        log.info("Saving address with id: {}", id);

        var city = cityService.getCityById(addressDTO.getCityId());
        var country = countryService.getCountryById(addressDTO.getCountryId());

        Address address = (id == null) ? new Address() : getAddressById(id);

        address.setCity(city);
        address.setCountry(country);
        address.setAddress(addressDTO.getAddress());

        return addressRepository.save(address);
    }

    public void deleteAddress(Long id) {
        log.info("Deleting address with id: {}", id);
        Address address = getAddressById(id);
        addressRepository.delete(address);
    }
}

