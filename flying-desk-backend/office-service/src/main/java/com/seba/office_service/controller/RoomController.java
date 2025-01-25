package com.seba.office_service.controller;

import com.seba.office_service.dto.RoomDTO;
import com.seba.office_service.model.Room;
import com.seba.office_service.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/building")
public class RoomController {

    private final RoomService roomService;

    /**
     * Tworzy nowy pokój w określonym budynku wraz z powiązanymi zdjęciami.
     *
     * @param roomDTO  Szczegóły pokoju
     * @param buildingId ID budynku przekazywane w ścieżce
     * @param files    Lista zdjęć powiązanych z pokojem
     * @return Zapisany pokój
     * @throws IOException W przypadku błędów podczas przetwarzania plików
     */
    @PostMapping("/{buildingId}/room")
    @ResponseStatus(HttpStatus.CREATED)
    public Room createRoom(
            @RequestPart("room") @Valid RoomDTO roomDTO,
            @PathVariable("buildingId") Long buildingId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        log.info("Creating room for building ID: {}, with {} files", buildingId, (files != null ? files.size() : 0));
        return roomService.createRoom(roomDTO, buildingId, files);
    }

    /**
     * Pobiera szczegóły pokoju na podstawie jego ID.
     *
     * @param roomId ID pokoju
     * @return Szczegóły pokoju
     */
    @GetMapping("/room/{roomId}")
    public Room getRoomById(@PathVariable("roomId") Long roomId) {
        log.info("Fetching room with ID: {}", roomId);
        return roomService.getRoomByIdWithPhotos(roomId);
    }

    @GetMapping("/rooms")
    public Page<Room> getAllRooms(
            @RequestParam(value = "buildingId", required = false) Long buildingId,
            @RequestParam(value = "isApproved", required = false) Boolean isApproved,
            @RequestParam(value = "name", required = false) String name,
            Pageable pageable
    ) {
        log.info("Fetching rooms with buildingId={}, isApproved={}, name={}", buildingId, isApproved, name);
        return roomService.getAllRoomsWithFilters(buildingId, isApproved, name, pageable);
    }

    /**
     * Pobiera pokoje z opcjonalnym filtrowaniem według statusu akceptacji.
     *
     * @param buildingId ID budynku (opcjonalne, dla ograniczenia do pokoi w konkretnym budynku)
     * @param isApproved Opcjonalny status akceptacji
     * @param pageable   Parametry paginacji
     * @return Strona pokoi
     */
    @GetMapping("/{buildingId}/rooms")
    public Page<Room> getRoomsInBuilding(
            @PathVariable("buildingId") Long buildingId,
            @RequestParam(value = "isApproved", required = false) Boolean isApproved,
            Pageable pageable
    ) {
        log.info("Fetching rooms in building ID: {}, with approval status: {}", buildingId, isApproved);
        return roomService.getRoomsByBuildingId(buildingId, isApproved, pageable);
    }
}
