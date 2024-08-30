package com.seba.office_spaces.repository;

import com.seba.office_spaces.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
