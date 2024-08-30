package com.seba.office_spaces.controller;

import com.seba.office_spaces.dto.RoomDTO;
import com.seba.office_spaces.model.Room;
import com.seba.office_spaces.service.RoomService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/room")
public class RoomController {

    private final String TAG = "RoomController - ";

    private final RoomService roomService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Room getRoom(@PathVariable Long id) {
        log.info(TAG + "Get room with id: " + id);
        return roomService.getRoomById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Room createRoom(@RequestBody RoomDTO room) {
        log.info(TAG + "Create new room: " + room);
        return roomService.createRoom(room);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Room updateRoom(@PathVariable Long id,
                           @RequestBody RoomDTO roomDetails) {
        log.info(TAG + "Update room with id: " + id);
        return roomService.updateRoom(id, roomDetails);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoom(@PathVariable Long id) {
        log.info(TAG + "Delete room with id: " + id);
        roomService.deleteRoom(id);
    }
}
