package com.seba.office_spaces.service;

import com.seba.office_spaces.dto.BuildingDTO;
import com.seba.office_spaces.exception.errors.ResourceNotFoundException;
import com.seba.office_spaces.model.Building;
import com.seba.office_spaces.repository.BuildingRepository;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final AddressService addressService;

    @SneakyThrows
    public Building getBuildingById(Long id) {
        return buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found"));
    }

    @SneakyThrows
    public Building createBuilding(BuildingDTO buildingDTO) {

        var address = addressService.getAddressById(buildingDTO.getAddressId());

        Building building = new Building();
        building.setAddress(address);
        building.setBuilding(buildingDTO.getBuilding());
        building.setDescription(buildingDTO.getDescription());

        return buildingRepository.save(building);
    }

    @SneakyThrows
    public Building updateBuilding(Long id, BuildingDTO buildingDTO) {

        var address = addressService.getAddressById(buildingDTO.getAddressId());

        Building building = getBuildingById(id);
        building.setAddress(address);
        building.setBuilding(buildingDTO.getBuilding());
        building.setDescription(buildingDTO.getDescription());

        return buildingRepository.save(building);
    }


    public void deleteBuilding(Long id) {

        buildingRepository.deleteById(id);
    }
}
