package com.campusconnect.dto.component2;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class ProgramDtos {
    private ProgramDtos() {
    }

    public record Request(
            @NotBlank String programName,
            @NotNull @Min(1) Integer durationYears,
            @NotBlank String status,
            Long facultyId 
    ) {
    }

    public record Response(
            Long programId,
            String programName,
            Integer durationYears,
            String status,
            Long facultyId,
            String facultyName
    ) {
    }
}

