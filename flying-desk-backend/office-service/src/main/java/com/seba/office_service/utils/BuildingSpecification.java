package com.seba.office_service.utils;

import com.seba.office_service.model.Building;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class BuildingSpecification {

    public static Specification<Building> hasIsApproved(Boolean isApproved) {
        return (root, query, criteriaBuilder) ->
                isApproved == null ? null : criteriaBuilder.equal(root.get("isApproved"), isApproved);
    }

    public static Specification<Building> hasStatus(Building.Status status) {
        return (root, query, criteriaBuilder) ->
                status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Building> hasSearch(String search) {
        return (root, query, criteriaBuilder) -> {
            if (search == null || search.isEmpty()) return null;
            String likeSearch = "%" + search + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(root.get("building"), likeSearch),
                    criteriaBuilder.like(root.get("description"), likeSearch)
            );
        };
    }

    public static Specification<Building> hasCountry(String country) {
        return (root, query, criteriaBuilder) ->
                country == null ? null : criteriaBuilder.equal(root.get("address").get("country").get("country"), country);
    }

    public static Specification<Building> hasCity(String city) {
        return (root, query, criteriaBuilder) ->
                city == null ? null : criteriaBuilder.equal(root.get("address").get("city").get("city"), city);
    }

    public static Specification<Building> hasCreationDateBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) return null;
            if (startDate != null && endDate != null) {
                return criteriaBuilder.between(root.get("creationDate"), startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
            } else if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("creationDate"), startDate.atStartOfDay());
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("creationDate"), endDate.atTime(23, 59, 59));
            }
        };

    }
}
