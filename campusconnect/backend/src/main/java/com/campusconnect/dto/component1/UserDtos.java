package com.campusconnect.dto.component1;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class UserDtos {
    private UserDtos() {
    }

    public record Request(
            @NotBlank String firstName,
            @NotBlank String lastName,
            @NotBlank @Email String email,
            @NotBlank String password,
            @NotBlank String status,
            @NotNull Long roleId,
            @NotNull Long batchId
    ) {
    }

    public record Response(
            Long userId,
            String firstName,
            String lastName,
            String email,
            String status,
            LocalDateTime createdAt,
            Long roleId,
            Long batchId
    ) {
    }
}

