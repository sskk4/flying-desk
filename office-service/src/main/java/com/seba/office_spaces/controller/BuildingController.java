package com.seba.office_spaces.controller;

import com.seba.office_spaces.dto.BuildingDTO;
import com.seba.office_spaces.model.Building;
import com.seba.office_spaces.service.BuildingService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/building")
public class BuildingController {

    private final String TAG = "BuildingController - ";

    private final BuildingService buildingService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Building getBuildingById(@PathVariable Long id) {
        log.info(TAG + "Get building by id: {}", id);
        return buildingService.getBuildingById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Building createBuilding(@RequestBody BuildingDTO building) {
        log.info(TAG + "Create new building: {}", building.getBuilding());
        return buildingService.createBuilding(building);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Building updateBuilding(@PathVariable Long id,
                                   @RequestBody BuildingDTO buildingDetails) {
        log.info(TAG + "Update building with id: {}", id);
        return buildingService.updateBuilding(id, buildingDetails);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBuilding(@PathVariable Long id) {
        log.info(TAG + "Delete building with id: {}", id);
        buildingService.deleteBuilding(id);
    }
}
