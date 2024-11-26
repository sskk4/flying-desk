package com.seba.office_service.controller;

import com.seba.office_service.dto.BuildingDTO;
import com.seba.office_service.model.Building;
import com.seba.office_service.service.BuildingService;
import com.seba.office_service.repository.BuildingRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/building")
public class BuildingController {

    private final String TAG = "BuildingController - ";

    private final BuildingService buildingService;
    private final BuildingRepository buildingRepository;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Building getBuildingById(@PathVariable Long id) {
        log.info(TAG + "Get building by id: {}", id);
        return buildingService.getBuildingById(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Building> getAllBuildings() {
        log.info(TAG + "Fetching all buildings");
        return buildingRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Building createBuilding(@RequestBody BuildingDTO building) {
        log.info(TAG + "Create new building: {}", building.getBuilding());
        return buildingService.saveBuilding(null, building);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Building updateBuilding(@PathVariable Long id,
                                   @RequestBody BuildingDTO buildingDetails) {
        log.info(TAG + "Update building with id: {}", id);
        return buildingService.saveBuilding(id, buildingDetails);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBuilding(@PathVariable Long id) {
        log.info(TAG + "Delete building with id: {}", id);
        buildingService.deleteBuilding(id);
    }
}
