package com.seba.office_spaces.repository;

import com.seba.office_spaces.model.Desk;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeskRepository extends JpaRepository<Desk, Long> {
}
