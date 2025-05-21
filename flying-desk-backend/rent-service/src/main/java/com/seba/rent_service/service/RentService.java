package com.seba.rent_service.service;

import com.seba.rent_service.dto.AvailabilityResponseDTO;
import com.seba.rent_service.dto.DayWithHoursResponseDTO;
import com.seba.rent_service.dto.TimeSlotResponseDTO;
import com.seba.rent_service.exception.AvailabilityResult;
import com.seba.rent_service.dto.RentRequestDTO;
import com.seba.rent_service.model.Rent;
import com.seba.rent_service.model.ResourceAvailability;
import com.seba.rent_service.repository.RentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RentService {

    private final RentRepository rentRepository;
    private final AvailabilityService availabilityService;

    public Optional<Rent> processRentRequest(RentRequestDTO dto) {
        Rent.ResourceType rentType = Rent.ResourceType.valueOf(dto.getResourceType().toUpperCase());
        ResourceAvailability.ResourceType availabilityType = mapRentTypeToAvailabilityType(rentType);

        AvailabilityResult result = checkAvailability(rentType, dto.getResourceId(), dto.getStartDate(), dto.getEndDate());

        if (result != AvailabilityResult.AVAILABLE) {
            log.info("Resource is not available: {}", result);
            return Optional.empty();
        }

        Rent rent = new Rent();
        rent.setUserId(dto.getUserId());
        rent.setResourceType(rentType);
        rent.setResourceId(dto.getResourceId());
        rent.setStartDate(dto.getStartDate());
        rent.setEndDate(dto.getEndDate());
        rent.setPrice(dto.getPrice());
        rent.setStatus(Rent.RentStatus.PENDING);

        return Optional.of(rentRepository.save(rent));
    }

    public AvailabilityResult checkAvailability(Rent.ResourceType rentType, Long resourceId,
                                                LocalDateTime start, LocalDateTime end) {
        log.info("Checking availability: type={}, id={}, from={}, to={}",
                rentType, resourceId, start, end);

        if (!isAvailable(rentType, resourceId, start, end)) {
            log.info("Found conflict with existing reservation");
            return AvailabilityResult.CONFLICT_WITH_EXISTING_RENT;
        }

        // Check availability schedule
        ResourceAvailability.ResourceType availabilityType = mapRentTypeToAvailabilityType(rentType);
        List<AvailabilityResponseDTO> availabilities = availabilityService.getAvailabilityForResource(availabilityType, resourceId);

        if (availabilities.isEmpty()) {
            log.info("No availability defined for the resource");
            return AvailabilityResult.NO_AVAILABILITY_DEFINED;
        }

        if (!isInAvailabilitySchedule(availabilityType, resourceId, start, end)) {
            log.info("Time period is outside the availability schedule");
            return AvailabilityResult.OUTSIDE_AVAILABILITY_SCHEDULE;
        }

        log.info("Resource is available");
        return AvailabilityResult.AVAILABLE;
    }

    private ResourceAvailability.ResourceType mapRentTypeToAvailabilityType(Rent.ResourceType rentType) {
        return ResourceAvailability.ResourceType.valueOf(rentType.name());
    }

    public boolean isAvailable(Rent.ResourceType type, Long resourceId, LocalDateTime start, LocalDateTime end) {
        return rentRepository.findByResourceTypeAndResourceId(type, resourceId).stream()
                .noneMatch(existing -> start.isBefore(existing.getEndDate()) && end.isAfter(existing.getStartDate()));
    }


    public boolean isInAvailabilitySchedule(ResourceAvailability.ResourceType type, Long resourceId,
                                            LocalDateTime start, LocalDateTime end) {
        List<AvailabilityResponseDTO> availabilities = availabilityService.getAvailabilityForResource(type, resourceId);

        if (availabilities.isEmpty()) {
            return false;
        }

        LocalDate startDate = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();

        for (LocalDate currentDate = startDate; !currentDate.isAfter(endDate); currentDate = currentDate.plusDays(1)) {
            final LocalDate dateToCheck = currentDate;
            String dayOfWeek = currentDate.getDayOfWeek().name();

            LocalTime startTimeToCheck = (currentDate.isEqual(startDate)) ? start.toLocalTime() : LocalTime.MIN;
            LocalTime endTimeToCheck = (currentDate.isEqual(endDate)) ? end.toLocalTime() : LocalTime.MAX;

            boolean timeSlotAvailable = availabilities.stream().anyMatch(availability -> {
                boolean inDateRange = !dateToCheck.isBefore(availability.getAvailableFrom()) &&
                        !dateToCheck.isAfter(availability.getAvailableTo());

                if (!inDateRange) {
                    return false;
                }

                Optional<DayWithHoursResponseDTO> matchingDay = availability.getAvailableDaysWithHours().stream()
                        .filter(day -> day.getDayOfWeek().equals(dayOfWeek))
                        .findFirst();

                if (matchingDay.isEmpty()) {
                    return false;
                }

                return isTimeSlotAvailable(matchingDay.get().getTimeSlots(), startTimeToCheck, endTimeToCheck);
            });

            if (!timeSlotAvailable) {
                return false;
            }
        }

        return true;
    }

    private boolean isTimeSlotAvailable(List<TimeSlotResponseDTO> timeSlots, LocalTime start, LocalTime end) {
        if (timeSlots == null || timeSlots.isEmpty()) {
            return false;
        }

        return timeSlots.stream().anyMatch(slot ->
                !start.isBefore(slot.getStartTime()) && !end.isAfter(slot.getEndTime())
        );
    }

    public Rent updateStatus(Long rentId, String status) {
        Rent rent = rentRepository.findById(rentId).orElseThrow(() -> new RuntimeException("Rent not found"));
        Rent.RentStatus newStatus = Rent.RentStatus.valueOf(status.toUpperCase());
        rent.setStatus(newStatus);
        return rentRepository.save(rent);
    }

    /**
     * Pobiera wszystkie rezerwacje dla panelu administratora
     *
     * @return lista wszystkich rezerwacji w systemie
     */
    public List<Rent> getAllRents() {
        log.info("Pobieranie wszystkich rezerwacji dla panelu administracyjnego");
        return rentRepository.findAll();
    }

    public List<Rent> getRentsByUser(Long userId) {
        return rentRepository.findByUserId(userId);
    }

    public Optional<Rent> getRentById(Long id) {
        return rentRepository.findById(id);
    }

    public List<Rent> getRentsByResourceTypeAndResourceId(Rent.ResourceType resourceType, Long resourceId) {
        if (resourceType == null || resourceId == null) {
            log.warn("Resource type or resource ID cannot be null");
            throw new IllegalArgumentException("Resource type and resource ID cannot be null");
        }
        return rentRepository.findByResourceTypeAndResourceId(resourceType, resourceId);
    }


    public Rent createRent(RentRequestDTO dto) {
        Rent.ResourceType rentType = Rent.ResourceType.valueOf(dto.getResourceType().toUpperCase());

        Rent rent = new Rent();
        rent.setUserId(dto.getUserId());
        rent.setResourceType(rentType);
        rent.setResourceId(dto.getResourceId());
        rent.setStartDate(dto.getStartDate());
        rent.setEndDate(dto.getEndDate());
        rent.setPrice(dto.getPrice());
        rent.setStatus(Rent.RentStatus.PENDING);

        return rentRepository.save(rent);
    }
}