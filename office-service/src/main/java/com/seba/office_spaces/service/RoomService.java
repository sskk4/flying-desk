package com.seba.office_spaces.service;

import com.seba.office_spaces.dto.RoomDTO;
import com.seba.office_spaces.exception.errors.ResourceNotFoundException;
import com.seba.office_spaces.model.Room;
import com.seba.office_spaces.repository.RoomRepository;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BuildingService buildingService;

    @SneakyThrows
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    }

    @SneakyThrows
    public Room createRoom(RoomDTO roomDTO) {

        var building = buildingService.getBuildingById(roomDTO.getBuildingId());

        Room room = new Room();
        room.setBuilding(building);
        //todo: equpiment

        return roomRepository.save(room);
    }

    @SneakyThrows
    public Room updateRoom(Long id, RoomDTO roomDTO) {
        var building = buildingService.getBuildingById(roomDTO.getBuildingId());

        Room room = getRoomById(id);
        room.setBuilding(building);
        //todo: equpiment

        return roomRepository.save(room);
    }

    @SneakyThrows
    public void deleteRoom(Long id) {

        roomRepository.deleteById(id);
    }
}
