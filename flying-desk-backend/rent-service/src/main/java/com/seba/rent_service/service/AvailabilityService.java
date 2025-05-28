package com.seba.rent_service.service;

import com.seba.rent_service.dto.*;
import com.seba.rent_service.model.ResourceAvailability;
import com.seba.rent_service.model.ResourceAvailabilityDay;
import com.seba.rent_service.model.ResourceAvailabilityHours;
import com.seba.rent_service.repository.ResourceAvailabilityDayRepository;
import com.seba.rent_service.repository.ResourceAvailabilityHoursRepository;
import com.seba.rent_service.repository.ResourceAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final ResourceAvailabilityRepository availabilityRepository;
    private final ResourceAvailabilityDayRepository dayRepository;
    private final ResourceAvailabilityHoursRepository hoursRepository;

    public ResourceAvailability createAvailability(ResourceAvailability availability) {
        return availabilityRepository.save(availability);
    }

    @Transactional(readOnly = true)
    public List<AvailabilityResponseDTO> getAvailabilityForResource(ResourceAvailability.ResourceType type, Long resourceId) {
        List<ResourceAvailability> availabilities = availabilityRepository.findByResourceTypeAndResourceId(type, resourceId);

        return availabilities.stream().map(availability -> {
            AvailabilityResponseDTO dto = new AvailabilityResponseDTO();
            dto.setId(availability.getId());
            dto.setResourceType(availability.getResourceType().name());
            dto.setResourceId(availability.getResourceId());
            dto.setAvailableFrom(availability.getAvailableFrom());
            dto.setAvailableTo(availability.getAvailableTo());
            dto.setCreatedAt(availability.getCreatedAt());
            dto.setUpdatedAt(availability.getUpdatedAt());

            List<ResourceAvailabilityDay> availableDays = dayRepository.findByAvailabilityId(availability.getId());

            List<DayWithHoursResponseDTO> daysWithHours = availableDays.stream().map(day -> {
                DayWithHoursResponseDTO dayDto = new DayWithHoursResponseDTO();
                dayDto.setDayOfWeek(day.getDayOfWeek().name());
                dayDto.setDayId(day.getId());

                List<ResourceAvailabilityHours> hours = hoursRepository.findByAvailabilityDayId(day.getId());

                List<TimeSlotResponseDTO> timeSlots = hours.stream().map(hour -> {
                    TimeSlotResponseDTO timeSlot = new TimeSlotResponseDTO();
                    timeSlot.setId(hour.getId());
                    timeSlot.setStartTime(hour.getStartTime());
                    timeSlot.setEndTime(hour.getEndTime());
                    return timeSlot;
                }).collect(Collectors.toList());

                dayDto.setTimeSlots(timeSlots);
                return dayDto;
            }).collect(Collectors.toList());

            dto.setAvailableDaysWithHours(daysWithHours);

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public AvailabilityResponseDTO createAvailabilityWithDays(AvailabilityRequestDTO dto) {
        ResourceAvailability availability = new ResourceAvailability();
        availability.setResourceType(ResourceAvailability.ResourceType.valueOf(dto.getResourceType().toUpperCase()));
        availability.setResourceId(dto.getResourceId());
        availability.setAvailableFrom(dto.getAvailableFrom());
        availability.setAvailableTo(dto.getAvailableTo());

        ResourceAvailability savedAvailability = availabilityRepository.save(availability);

        List<DayWithHoursResponseDTO> responseList = new ArrayList<>();

        for (DayWithHoursDTO dayDto : dto.getAvailableDaysWithHours()) {
            ResourceAvailabilityDay day = new ResourceAvailabilityDay();
            day.setAvailability(savedAvailability);
            day.setDayOfWeek(ResourceAvailabilityDay.DayOfWeekEnum.valueOf(dayDto.getDayOfWeek().toUpperCase()));
            ResourceAvailabilityDay savedDay = dayRepository.save(day);

            DayWithHoursResponseDTO dayResponse = new DayWithHoursResponseDTO();
            dayResponse.setDayOfWeek(savedDay.getDayOfWeek().name());
            dayResponse.setDayId(savedDay.getId());
            List<TimeSlotResponseDTO> timeSlotResponses = new ArrayList<>();

            if (dayDto.getTimeSlots() != null && !dayDto.getTimeSlots().isEmpty()) {
                for (TimeSlotDTO timeSlotDto : dayDto.getTimeSlots()) {
                    ResourceAvailabilityHours hours = new ResourceAvailabilityHours();
                    hours.setAvailabilityDay(savedDay);
                    hours.setStartTime(timeSlotDto.getStartTime());
                    hours.setEndTime(timeSlotDto.getEndTime());
                    ResourceAvailabilityHours savedHours = hoursRepository.save(hours);

                    TimeSlotResponseDTO timeSlotResponse = new TimeSlotResponseDTO();
                    timeSlotResponse.setId(savedHours.getId());
                    timeSlotResponse.setStartTime(savedHours.getStartTime());
                    timeSlotResponse.setEndTime(savedHours.getEndTime());
                    timeSlotResponses.add(timeSlotResponse);
                }
            }

            dayResponse.setTimeSlots(timeSlotResponses);
            responseList.add(dayResponse);
        }

        AvailabilityResponseDTO responseDTO = new AvailabilityResponseDTO();
        responseDTO.setId(savedAvailability.getId());
        responseDTO.setResourceType(savedAvailability.getResourceType().name());
        responseDTO.setResourceId(savedAvailability.getResourceId());
        responseDTO.setAvailableFrom(savedAvailability.getAvailableFrom());
        responseDTO.setAvailableTo(savedAvailability.getAvailableTo());
        responseDTO.setAvailableDaysWithHours(responseList);
        responseDTO.setCreatedAt(savedAvailability.getCreatedAt());
        responseDTO.setUpdatedAt(savedAvailability.getUpdatedAt());

        return responseDTO;
    }

    public List<ResourceAvailabilityDay> getAvailableDays(Long availabilityId) {
        return dayRepository.findByAvailabilityId(availabilityId);
    }

    public List<ResourceAvailabilityHours> getAvailableHours(Long dayId) {
        return hoursRepository.findByAvailabilityDayId(dayId);
    }

    public boolean isResourceAvailable(ResourceAvailability.ResourceType type, Long resourceId, String date, String startTime, String endTime) {
        LocalDate targetDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
        LocalTime targetStart = LocalTime.parse(startTime);
        LocalTime targetEnd = LocalTime.parse(endTime);

        List<AvailabilityResponseDTO> availabilities = getAvailabilityForResource(type, resourceId);

        for (AvailabilityResponseDTO availability : availabilities) {
            if ((availability.getAvailableFrom() == null || !targetDate.isAfter(availability.getAvailableTo())) &&
                    (availability.getAvailableTo() == null || !targetDate.isAfter(availability.getAvailableTo()))) {

                String dayOfWeek = targetDate.getDayOfWeek().name(); // e.g. "MONDAY"

                for (DayWithHoursResponseDTO day : availability.getAvailableDaysWithHours()) {
                    if (day.getDayOfWeek().equalsIgnoreCase(dayOfWeek)) {
                        for (TimeSlotResponseDTO slot : day.getTimeSlots()) {
                            LocalTime slotStart = slot.getStartTime();
                            LocalTime slotEnd = slot.getEndTime();

                            if (!slotStart.isAfter(targetStart) && !slotEnd.isBefore(targetEnd)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

}