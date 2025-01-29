package com.seba.office_service.utils;

import com.seba.office_service.model.Building;
import com.seba.office_service.model.Desk;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class DeskSpecification {

    public static Specification<Desk> withBuildingId(Long buildingId) {
        return (root, query, criteriaBuilder) -> {
            if (buildingId == null) return null;
            return criteriaBuilder.equal(root.get("building").get("id"), buildingId);
        };
    }

    public static Specification<Desk> withApprovalStatus(Boolean isApproved) {
        return (root, query, criteriaBuilder) -> {
            if (isApproved == null) return null;
            return criteriaBuilder.equal(root.get("isApproved"), isApproved);
        };
    }


    public static Specification<Desk> hasSearch(String search) {
        return (root, query, criteriaBuilder) -> {
            if (search == null || search.isEmpty()) return null;
            String likeSearch = "%" + search + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(root.get("desk"), likeSearch),
                    criteriaBuilder.like(root.get("description"), likeSearch)
            );
        };
    }


    public static Specification<Desk> withStatus(Desk.Status status) {
        return (root, query, criteriaBuilder) ->
                status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Desk> withPriceBetween(Double minPrice, Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null) {
                return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            }
        };
    }


    public static Specification<Desk> withEquipmentContaining(String equipment) {
        return (root, query, criteriaBuilder) -> {
            if (equipment == null || equipment.isEmpty()) return null;
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("equipment")), "%" + equipment.toLowerCase() + "%");
        };
    }

    public static Specification<Desk> withCreationDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) return null;
            if (startDate != null && endDate != null) {
                return criteriaBuilder.between(root.get("creationDate"), startDate, endDate);
            } else if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("creationDate"), startDate);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("creationDate"), endDate);
            }
        };
    }

    public static Specification<Desk> withBuildingCountry(String country) {
        return (root, query, criteriaBuilder) -> {
            if (country == null || country.isEmpty()) return null;
            return criteriaBuilder.equal(
                    root.get("building").get("address").get("country").get("country"),
                    country
            );
        };
    }

    public static Specification<Desk> withBuildingCity(String city) {
        return (root, query, criteriaBuilder) -> {
            if (city == null || city.isEmpty()) return null;
            return criteriaBuilder.equal(
                    root.get("building").get("address").get("city").get("city"),
                    city
            );
        };
    }

}
