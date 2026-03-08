package com.campusconnect.dto.component1;

import jakarta.validation.constraints.NotBlank;

public final class PermissionDtos {
    private PermissionDtos() {
    }

    public record Request(
            @NotBlank String permissionName,
            String description
    ) {
    }

    public record Response(
            Long permissionId,
            String permissionName,
            String description
    ) {
    }
}

