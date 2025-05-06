package com.seba.office_service.repository;

import com.seba.office_service.model.Building;
import com.seba.office_service.model.Desk;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeskRepository extends JpaRepository<Desk, Long>, JpaSpecificationExecutor<Desk> {
    Page<Desk> findByBuilding(Building building, Pageable pageable);
    Page<Desk> findByBuildingAndIsApproved(Building building, Boolean isApproved, Pageable pageable);
    Page<Desk> findByIsApproved(Boolean isApproved, Pageable pageable);

    @Query("SELECT d FROM Desk d WHERE d.building.id IN :buildingIds")
    Page<Desk> findByBuilding(@Param("buildingIds") List<Long> buildingIds, Pageable pageable);
}
