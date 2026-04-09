package com.campusconnect.dto.component2;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class FacultyDtos {
    private FacultyDtos() {}

    public record Request(
            @NotBlank String facultyName,
            @NotBlank String status,
            @NotNull Long campusId   // ✅ IMPORTANT
    ) {}

    public record Response(
            Long facultyId,
            String facultyName,
            String status,
            Long campusId            // ✅ include for frontend
    ) {}
}