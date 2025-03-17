package com.seba.rent_service.controller;

import com.seba.rent_service.model.DeskRentOption;
import com.seba.rent_service.model.DeskRentDay;
import com.seba.rent_service.model.DayOfWeekEnum;
import com.seba.rent_service.service.DeskRentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/desk-rent")
@RequiredArgsConstructor
public class DeskRentController {

    private final DeskRentService deskRentService;

    @PostMapping
    public ResponseEntity<DeskRentOption> createDeskRentOption(@RequestBody DeskRentOption option) {
        return ResponseEntity.ok(deskRentService.createDeskRentOption(option));
    }

    @GetMapping
    public ResponseEntity<List<DeskRentOption>> getAllDeskRentOptions() {
        return ResponseEntity.ok(deskRentService.getAllDeskRentOptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeskRentOption> getDeskRentOptionById(@PathVariable Long id) {
        Optional<DeskRentOption> option = deskRentService.getDeskRentOptionById(id);
        return option.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/desk/{deskId}")
    public ResponseEntity<List<DeskRentOption>> getDeskRentOptionsByDeskId(@PathVariable Long deskId) {
        return ResponseEntity.ok(deskRentService.getDeskRentOptionsByDeskId(deskId));
    }

    @GetMapping("/days/{optionId}")
    public ResponseEntity<List<DeskRentDay>> getDeskRentDaysByOptionId(@PathVariable Long optionId) {
        return ResponseEntity.ok(deskRentService.getDeskRentDaysByOptionId(optionId));
    }

    @GetMapping("/days/week/{dayOfWeek}")
    public ResponseEntity<List<DeskRentDay>> getDeskRentDaysByDayOfWeek(@PathVariable DayOfWeekEnum dayOfWeek) {
        return ResponseEntity.ok(deskRentService.getDeskRentDaysByDayOfWeek(dayOfWeek));
    }
}
