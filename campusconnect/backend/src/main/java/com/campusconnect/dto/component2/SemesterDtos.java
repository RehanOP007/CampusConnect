package com.campusconnect.dto.component2;

import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public final class SemesterDtos {
    private SemesterDtos() {
    }

    public record Request(
             @Min(1) Integer yearNumber,
             @Min(1) Integer semesterNumber,
             LocalDate startDate,
             LocalDate endDate,
             String status,
             Long batchId
    ) {
    }

    public record Response(
            Long semesterId,
            Integer yearNumber,
            Integer semesterNumber,
            LocalDate startDate,
            LocalDate endDate,
            String status,
            Long batchId
    ) {
    }
}

