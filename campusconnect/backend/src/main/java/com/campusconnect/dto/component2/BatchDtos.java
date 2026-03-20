package com.campusconnect.dto.component2;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class BatchDtos {
    private BatchDtos() {
    }

    public record Request(
            @NotNull @Min(1900) @Max(2500) Integer intakeYear,

            @NotBlank 
            String intakeMonth,

            @NotBlank
            String batchName,

            @NotBlank 
            String status,
 
            Long campusId,
            Long curriculumId
    ) {
    }

    public record Response(
            Long batchId,
            String batchName,
            Integer intakeYear,
            String intakeMonth,
            String status,
            LocalDateTime createdAt,
            Long campusId,
            Long curriculumId
    ) {
    }
}

