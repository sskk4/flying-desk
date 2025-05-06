package com.seba.rent_service.repository;

import com.seba.rent_service.model.ResourceAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceAvailabilityRepository extends JpaRepository<ResourceAvailability, Long> {
    List<ResourceAvailability> findByResourceTypeAndResourceId(ResourceAvailability.ResourceType resourceType, Long resourceId);
}
