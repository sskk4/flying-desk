package com.seba.rent_service.controller;

import com.seba.rent_service.exception.AvailabilityResult;
import com.seba.rent_service.exception.ErrorResponse;
import com.seba.rent_service.dto.RentRequestDTO;
import com.seba.rent_service.model.Rent;
import com.seba.rent_service.service.RentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rent")
public class RentController {

    private final RentService rentService;

    @PostMapping
    public ResponseEntity<?> createRent(@Valid @RequestBody RentRequestDTO dto) {
        try {
            Rent.ResourceType rentType = Rent.ResourceType.valueOf(dto.getResourceType().toUpperCase());

            AvailabilityResult result = rentService.checkAvailability(
                    rentType, dto.getResourceId(), dto.getStartDate(), dto.getEndDate());

            if (result != AvailabilityResult.AVAILABLE) {
                String message;
                switch (result) {
                    case CONFLICT_WITH_EXISTING_RENT:
                        message = "Zasób jest już zarezerwowany w tym czasie";
                        break;
                    case OUTSIDE_AVAILABILITY_SCHEDULE:
                        message = "Zasób nie jest dostępny w wybranych dniach lub godzinach";
                        break;
                    case NO_AVAILABILITY_DEFINED:
                        message = "Dla tego zasobu nie zdefiniowano harmonogramu dostępności";
                        break;
                    default:
                        message = "Nieznany błąd dostępności";
                }

                ErrorResponse errorResponse = new ErrorResponse("Rezerwacja niemożliwa", message);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Rent rent = rentService.createRent(dto);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Rezerwacja została utworzona pomyślnie");
            response.put("rent", rent);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Błąd podczas tworzenia rezerwacji", e);
            ErrorResponse errorResponse = new ErrorResponse("Błąd przetwarzania", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRentStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Rent.RentStatus rentStatus = Rent.RentStatus.valueOf(status.toUpperCase());
            Rent updatedRent = rentService.updateStatus(id, rentStatus.name());
            return ResponseEntity.ok(updatedRent);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid rent status");
            errorResponse.put("message", "Allowed values: PENDING, PAID, CANCELLED");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Rent not found");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/resource")
    public ResponseEntity<List<Rent>> getRentsByResourceTypeAndResourceId(
            @RequestParam("resourceType") Rent.ResourceType resourceType,
            @RequestParam("resourceId") Long resourceId) {

        log.info("Otrzymano żądanie dla resourceType={} i resourceId={}", resourceType, resourceId);

        try {
            List<Rent> rents = rentService.getRentsByResourceTypeAndResourceId(resourceType, resourceId);
            log.info("Znaleziono {} wynajmów", rents.size());
            log.debug("Znalezione wynajmy: {}", rents);

            return ResponseEntity.ok(rents);
        } catch (IllegalArgumentException e) {
            log.error("Błąd podczas pobierania wynajmów", e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rent>> getRentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(rentService.getRentsByUser(userId));
    }

    /**
     * Endpoint dla panelu administracyjnego do pobierania wszystkich rezerwacji
     *
     * @return lista wszystkich rezerwacji w systemie
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<Rent>> getAllRentsForAdmin() {
        log.info("Pobieranie wszystkich rezerwacji dla panelu administracyjnego");
        List<Rent> allRents = rentService.getAllRents();
        log.info("Znaleziono łącznie {} rezerwacji", allRents.size());
        return ResponseEntity.ok(allRents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rent> getRentById(@PathVariable Long id) {
        return rentService.getRentById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}