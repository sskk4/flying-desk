package com.seba.office_service.repository;

import com.seba.office_service.model.Building;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.seba.office_service.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;



public interface RoomRepository extends JpaRepository<Room, Long> {
    Page<Room> findByIsApproved(Boolean isApproved, Pageable pageable);

    Page<Room> findByBuilding(Building building, Pageable pageable);

    Page<Room> findByBuildingAndIsApproved(Building building, Boolean isApproved, Pageable pageable);

}
