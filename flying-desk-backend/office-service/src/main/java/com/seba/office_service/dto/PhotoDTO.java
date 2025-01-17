package com.seba.office_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PhotoDTO {

    @NotBlank(message = "Photo URL is required")
    private String url; // URL zdjęcia

    @NotBlank(message = "Photo type is required (BUILDING, ROOM, DESK, SUBMISSION)")
    private String photoType; // Typ zdjęcia

    @NotNull(message = "Related ID is required")
    private Long relatedId; // ID obiektu, z którym zdjęcie jest powiązane
}