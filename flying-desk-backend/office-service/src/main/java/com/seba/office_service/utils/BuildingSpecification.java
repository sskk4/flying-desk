package com.seba.office_service.utils;

import com.seba.office_service.model.Building;
import org.springframework.data.jpa.domain.Specification;

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
}
