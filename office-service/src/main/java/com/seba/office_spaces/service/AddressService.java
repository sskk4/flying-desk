package com.seba.office_spaces.service;

import com.seba.office_spaces.dto.AddressDTO;
import com.seba.office_spaces.model.Address;
import com.seba.office_spaces.exception.errors.ResourceNotFoundException;
import com.seba.office_spaces.repository.AddressRepository;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final CountryService countryService;
    private final CityService cityService;

    @SneakyThrows
    public Address getAddressById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id " + id));
    }

    @SneakyThrows
    public Address createAddress(AddressDTO addressDTO) {

        var city = cityService.getCityById(addressDTO.getCityId());
        var country = countryService.getCountryById(addressDTO.getCountryId());

        Address address = new Address();
        address.setCity(city);
        address.setCountry(country);
        address.setAddress(addressDTO.getAddress());

        return addressRepository.save(address);
    }

    @SneakyThrows
    public Address updateAddress(Long id, AddressDTO addressDTO) {

        var city = cityService.getCityById(addressDTO.getCityId());
        var country = countryService.getCountryById(addressDTO.getCountryId());

        Address address = getAddressById(id);
        address.setCity(city);
        address.setCountry(country);
        address.setAddress(addressDTO.getAddress());

        return addressRepository.save(address);
    }

    @SneakyThrows
    public void deleteAddress(Long id) {
        Address address = getAddressById(id);
        addressRepository.delete(address);
    }
}
