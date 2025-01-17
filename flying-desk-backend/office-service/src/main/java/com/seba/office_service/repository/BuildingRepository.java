package com.seba.office_service.repository;

import com.seba.office_service.model.Building;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    /**
     * Znajduje budynki na podstawie statusu zatwierdzenia.
     *
     * @param isApproved Status zatwierdzenia (true/false).
     * @param pageable   Parametry paginacji.
     * @return Strona z budynkami spełniającymi warunki filtrowania.
     */
    Page<Building> findByIsApproved(Boolean isApproved, Pageable pageable);

    Page<Building> findAllByUserId(Long userId, Pageable pageable);
}
