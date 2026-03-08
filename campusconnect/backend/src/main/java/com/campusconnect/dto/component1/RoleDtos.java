package com.campusconnect.dto.component1;

import jakarta.validation.constraints.NotBlank;

public final class RoleDtos {
    private RoleDtos() {
    }

    public record Request(
            @NotBlank String roleName,
            String description
    ) {
    }

    public record Response(
            Long roleId,
            String roleName,
            String description
    ) {
    }
}

