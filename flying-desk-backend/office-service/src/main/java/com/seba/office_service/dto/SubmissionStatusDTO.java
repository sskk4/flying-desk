package com.seba.office_service.dto;

import com.seba.office_service.model.Submission;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionStatusDTO {
    private Submission.Status status;
    private String rejectionReason;
    private Long submissionId;

    // Factory method to create from a Submission
    public static SubmissionStatusDTO fromSubmission(Submission submission) {
        SubmissionStatusDTO dto = new SubmissionStatusDTO();
        dto.setStatus(submission.getStatus());
        dto.setRejectionReason(submission.getRejectionReason());
        dto.setSubmissionId(submission.getId());
        return dto;
    }
}