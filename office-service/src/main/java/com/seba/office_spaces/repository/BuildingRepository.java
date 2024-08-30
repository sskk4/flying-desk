package com.seba.office_spaces.repository;

import com.seba.office_spaces.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {
}
