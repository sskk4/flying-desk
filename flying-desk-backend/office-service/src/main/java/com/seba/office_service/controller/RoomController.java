package com.seba.office_service.controller;

import com.seba.office_service.dto.RoomDTO;
import com.seba.office_service.model.Desk;
import com.seba.office_service.model.Room;
import com.seba.office_service.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
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
     * @param roomDTO    Szczegóły pokoju
     * @param buildingId ID budynku przekazywane w ścieżce
     * @param files      Lista zdjęć powiązanych z pokojem (opcjonalnie)
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
     * Pobiera listę pokoi z opcjonalnym filtrowaniem według różnych parametrów.
     *
     * @param search       Wyszukiwanie po nazwie lub opisie
     * @param isApproved   Filtrowanie po zatwierdzeniu
     * @param status       Filtrowanie po statusie
     * @param country      Filtrowanie po kraju budynku
     * @param city         Filtrowanie po mieście budynku
     * @param startDate    Filtrowanie po dacie początkowej
     * @param endDate      Filtrowanie po dacie końcowej
     * @param equipment    Filtrowanie po wyposażeniu
     * @param minOccupants Minimalna liczba osób
     * @param maxOccupants Maksymalna liczba osób
     * @param minPrice     Minimalna cena
     * @param maxPrice     Maksymalna cena
     * @param sortBy       Pole do sortowania
     * @param sortDir      Kierunek sortowania
     * @param pageable     Parametry paginacji
     * @return Strona z pokojami
     */
    @GetMapping("/rooms")
    public Page<Room> getRooms(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isApproved,
            @RequestParam(required = false) Room.Status status,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) Integer minOccupants,
            @RequestParam(required = false) Integer maxOccupants,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return roomService.getAllRoomsWithFilters(
                null,
                isApproved,
                search,
                equipment,
                status,
                country,
                city,
                startDate,
                endDate,
                minOccupants,
                maxOccupants,
                minPrice,
                maxPrice,
                sortBy,
                sortDir,
                pageable
        );
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

    /**
     * Pobiera pokoje należące do budynków danego użytkownika.
     *
     * @param userId    ID użytkownika
     * @param pageable  Parametry paginacji
     * @return Strona pokoi
     */
    @GetMapping("/user/{userId}/rooms")
    public Page<Room> getRoomsByUserId(
            @PathVariable("userId") Long userId,
            Pageable pageable
    ) {
        log.info("Fetching rooms for user ID: {}", userId);
        return roomService.getRoomsByUserId(userId, pageable);
    }


    /**
     * Pobiera pokoje w określonym budynku z opcjonalnym filtrowaniem według statusu akceptacji.
     *
     * @param buildingId ID budynku
     * @param isApproved Opcjonalny status akceptacji (true/false)
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

    /**
     * Zmienia status akceptacji pokoju.
     *
     * @param roomId     ID pokoju
     * @param isApproved Nowy status zaakceptowania
     * @return Zaktualizowany pokój
     */
    @PatchMapping("/room/{roomId}/approve")
    @ResponseStatus(HttpStatus.OK)
    public Room changeRoomApprovalStatus(
            @PathVariable("roomId") Long roomId,
            @RequestParam("isApproved") Boolean isApproved
    ) {
        log.info("Updating approval status for room ID: {} to: {}", roomId, isApproved);
        return roomService.updateRoomApprovalStatus(roomId, isApproved);
    }
}