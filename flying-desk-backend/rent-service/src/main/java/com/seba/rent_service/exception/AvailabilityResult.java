package com.seba.rent_service.exception;

public enum AvailabilityResult {
    AVAILABLE,
    CONFLICT_WITH_EXISTING_RENT,
    OUTSIDE_AVAILABILITY_SCHEDULE,
    NO_AVAILABILITY_DEFINED
}