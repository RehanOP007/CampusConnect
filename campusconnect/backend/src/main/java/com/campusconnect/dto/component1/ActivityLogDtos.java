package com.campusconnect.dto.component1;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class ActivityLogDtos {
    private ActivityLogDtos() {
    }

    public record Request(
            @NotBlank String actionType,
            @NotBlank String description,
            LocalDateTime timestamp,
            @NotNull Long userId
    ) {
    }

    public record Response(
            Long logId,
            String actionType,
            String description,
            LocalDateTime timestamp,
            Long userId
    ) {
    }
}

