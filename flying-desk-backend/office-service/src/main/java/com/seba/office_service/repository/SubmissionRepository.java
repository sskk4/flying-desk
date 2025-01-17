package com.seba.office_service.repository;

import com.seba.office_service.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}