package com.seba.office_service.utils;

import com.seba.office_service.model.Building;
import com.seba.office_service.model.Room;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

/**
 * Klasa zawierająca specyfikacje do filtrowania pokoi zgodnie z różnymi kryteriami.
 */
public class RoomSpecification {

    /**
     * Filtrowanie według ID budynku
     */
    public static Specification<Room> withBuildingId(Long buildingId) {
        return buildingId == null ? null : (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("building").get("id"), buildingId);
    }

    /**
     * Filtrowanie według statusu zatwierdzenia
     */
    public static Specification<Room> withApprovalStatus(Boolean isApproved) {
        return isApproved == null ? null : (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isApproved"), isApproved);
    }

    /**
     * Wyszukiwanie według nazwy lub opisu
     */
    public static Specification<Room> hasSearch(String search) {
        return search == null ? null : (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("room")), "%" + search.toLowerCase() + "%"),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + search.toLowerCase() + "%")
                );
    }

    /**
     * Filtrowanie według wyposażenia
     */
    public static Specification<Room> withEquipmentContaining(String equipment) {
        return equipment == null ? null : (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("equipment")), "%" + equipment.toLowerCase() + "%");
    }

    /**
     * Filtrowanie według statusu
     */
    public static Specification<Room> withStatus(Room.Status status) {
        return status == null ? null : (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    /**
     * Filtrowanie według kraju budynku
     */
    public static Specification<Room> withBuildingCountry(String country) {
        return country == null ? null : (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(criteriaBuilder.lower(root.get("building").get("country")), country.toLowerCase());
    }

    /**
     * Filtrowanie według miasta budynku
     */
    public static Specification<Room> withBuildingCity(String city) {
        return city == null ? null : (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(criteriaBuilder.lower(root.get("building").get("city")), city.toLowerCase());
    }

    /**
     * Filtrowanie według zakresu dat utworzenia
     */
    public static Specification<Room> withCreationDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null && endDate == null) {
            return null;
        }
        if (startDate == null) {
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("creationDate"), endDate);
        }
        if (endDate == null) {
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("creationDate"), startDate);
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("creationDate"), startDate, endDate);
    }

    /**
     * Filtrowanie według zakresu liczby osób
     */
    public static Specification<Room> withOccupantsBetween(Integer minOccupants, Integer maxOccupants) {
        if (minOccupants == null && maxOccupants == null) {
            return null;
        }
        if (minOccupants == null) {
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("maxOccupants"), maxOccupants);
        }
        if (maxOccupants == null) {
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("maxOccupants"), minOccupants);
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("maxOccupants"), minOccupants, maxOccupants);
    }

    /**
     * Filtrowanie według zakresu cen
     */
    public static Specification<Room> withPriceBetween(Double minPrice, Double maxPrice) {
        if (minPrice == null && maxPrice == null) {
            return null;
        }
        if (minPrice == null) {
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        }
        if (maxPrice == null) {
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
    }
}