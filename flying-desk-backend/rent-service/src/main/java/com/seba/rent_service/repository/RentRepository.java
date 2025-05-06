package com.seba.rent_service.repository;


import com.seba.rent_service.model.Rent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RentRepository extends JpaRepository<Rent, Long> {
    List<Rent> findByUserId(Long userId);
    List<Rent> findByResourceTypeAndResourceId(Rent.ResourceType resourceType, Long resourceId);
}
