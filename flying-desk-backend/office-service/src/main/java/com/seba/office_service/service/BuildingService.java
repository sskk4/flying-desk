package com.seba.office_service.service;

import com.seba.office_service.cloud.CDNService;
import com.seba.office_service.cloud.PhotoService;
import com.seba.office_service.dto.BuildingDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.repository.BuildingRepository;
import com.seba.office_service.model.Building;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final AddressService addressService;
    private final PhotoService photoService;
    private final CDNService cdnService;

    public Building getBuildingById(Long id) {
        log.info("Fetching building with id: {}", id);
        return buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found"));
    }

    public Building saveBuilding(Long id, BuildingDTO buildingDTO) {
        log.info("Saving building with id: {}", id);

        var address = addressService.getAddressById(buildingDTO.getAddressId());


        String photoUrl = buildingDTO.getPhoto();

        Building building = (id == null) ? new Building() : getBuildingById(id);

        building.setAddress(address);
        building.setBuilding(buildingDTO.getBuilding());
        building.setDescription(buildingDTO.getDescription());
        building.setPhotoUrl(photoUrl);

        return buildingRepository.save(building);
    }


    public void deleteBuilding(Long id) {
        log.info("Deleting building with id: {}", id);
        buildingRepository.deleteById(id);
    }
}

