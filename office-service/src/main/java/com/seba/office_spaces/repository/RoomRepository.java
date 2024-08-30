package com.seba.office_spaces.repository;

import com.seba.office_spaces.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
