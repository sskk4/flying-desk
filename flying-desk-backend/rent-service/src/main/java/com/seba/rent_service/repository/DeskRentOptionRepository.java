package com.seba.rent_service.repository;

import com.seba.rent_service.model.DeskRentOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeskRentOptionRepository extends JpaRepository<DeskRentOption, Long> {
    List<DeskRentOption> findByDeskId(Long deskId);
}
