package com.campusconnect.dto.component2;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class SubjectDtos {
    private SubjectDtos() {
    }

    public record Request(
            @NotBlank String subjectCode,
            @NotBlank String subjectName,
            @NotNull @Min(1) Integer yearNumber,
            @NotNull @Min(1) Integer semesterNumber,
            @NotNull @Min(0) Integer credits,
            @NotNull Long curriculumId
    ) {
    }

    public record Response(
            Long subjectId,
            String subjectCode,
            String subjectName,
            Integer yearNumber,
            Integer semesterNumber,
            Integer credits,
            Long curriculumId
    ) {
    }
}

