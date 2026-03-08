package com.campusconnect.dto.component3;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class StudyGroupDtos {
    private StudyGroupDtos() {
    }

    public record Request(
            @NotBlank String groupName,
            @NotBlank String status,
            @NotNull Long subjectId,
            @NotNull Long semesterId,
            @NotNull Long createdByUserId
    ) {
    }

    public record Response(
            Long groupId,
            String groupName,
            String status,
            LocalDateTime createdAt,
            Long subjectId,
            Long semesterId,
            Long createdByUserId
    ) {
    }
}

