package com.seba.office_spaces.controller;

import com.seba.office_spaces.dto.AddressDTO;
import com.seba.office_spaces.model.Address;
import com.seba.office_spaces.service.AddressService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/address")
public class AddressController {

    private final String TAG = "AddressController - ";

    private final AddressService addressService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Address getAddressById(@PathVariable Long id) {
        log.info(TAG + "Get address by id: {}", id);
        return addressService.getAddressById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Address createAddress(@RequestParam("title") AddressDTO address) {
        log.info(TAG + "Create new address: {}", address.getAddress());
        return addressService.createAddress(address);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Address updateAddress(@PathVariable Long id,
                                 @RequestBody AddressDTO addressDetails) {
        log.info(TAG + "Update address with id: {}", id);
        return addressService.updateAddress(id, addressDetails);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(@PathVariable Long id) {
        log.info(TAG + "Delete address with id: {}", id);
        addressService.deleteAddress(id);
    }

}
