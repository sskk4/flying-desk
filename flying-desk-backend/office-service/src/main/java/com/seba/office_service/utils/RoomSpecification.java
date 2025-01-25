package com.seba.office_service.utils;

import com.seba.office_service.model.Room;
import org.springframework.data.jpa.domain.Specification;

public class RoomSpecification {

    public static Specification<Room> withBuildingId(Long buildingId) {
        return (root, query, criteriaBuilder) ->
                buildingId != null ? criteriaBuilder.equal(root.get("building").get("id"), buildingId) : null;
    }

    public static Specification<Room> withApprovalStatus(Boolean isApproved) {
        return (root, query, criteriaBuilder) ->
                isApproved != null ? criteriaBuilder.equal(root.get("isApproved"), isApproved) : null;
    }

    public static Specification<Room> withNameContaining(String name) {
        return (root, query, criteriaBuilder) ->
                name != null ? criteriaBuilder.like(root.get("room"), "%" + name + "%") : null;
    }
}
