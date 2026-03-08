package com.campusconnect.dto.component2;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class ProgramDtos {
    private ProgramDtos() {
    }

    public record Request(
            @NotBlank String programName,
            @NotBlank String facultyName,
            @NotNull @Min(1) Integer durationYears,
            @NotBlank String status
    ) {
    }

    public record Response(
            Long programId,
            String programName,
            String facultyName,
            Integer durationYears,
            String status
    ) {
    }
}

