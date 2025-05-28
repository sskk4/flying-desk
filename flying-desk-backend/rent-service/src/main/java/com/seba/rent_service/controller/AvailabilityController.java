package com.seba.rent_service.controller;

import com.seba.rent_service.dto.AvailabilityRequestDTO;
import com.seba.rent_service.dto.AvailabilityResponseDTO;
import com.seba.rent_service.model.ResourceAvailability;
import com.seba.rent_service.model.ResourceAvailabilityDay;
import com.seba.rent_service.model.ResourceAvailabilityHours;
import com.seba.rent_service.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<AvailabilityResponseDTO> createAvailability(@RequestBody AvailabilityRequestDTO availability) {
        return ResponseEntity.ok(availabilityService.createAvailabilityWithDays(availability));
    }

    @GetMapping("/resource")
    public ResponseEntity<List<AvailabilityResponseDTO>> getAvailability(
            @RequestParam ResourceAvailability.ResourceType type,
            @RequestParam Long resourceId) {
        return ResponseEntity.ok(availabilityService.getAvailabilityForResource(type, resourceId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam ResourceAvailability.ResourceType resourceType,
            @RequestParam Long resourceId,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime
    ) {
        boolean isAvailable = availabilityService.isResourceAvailable(resourceType, resourceId, date, startTime, endTime);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/days/{availabilityId}")
    public ResponseEntity<List<ResourceAvailabilityDay>> getAvailableDays(@PathVariable Long availabilityId) {
        return ResponseEntity.ok(availabilityService.getAvailableDays(availabilityId));
    }

    @GetMapping("/hours/{dayId}")
    public ResponseEntity<List<ResourceAvailabilityHours>> getAvailableHours(@PathVariable Long dayId) {
        return ResponseEntity.ok(availabilityService.getAvailableHours(dayId));
    }
}