package com.seba.office_service.repository;

import com.seba.office_service.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByPhotoTypeAndRelatedId(String photoType, Long relatedId);
}