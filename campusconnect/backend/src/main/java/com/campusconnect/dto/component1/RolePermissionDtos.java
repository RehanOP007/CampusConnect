package com.campusconnect.dto.component1;

import jakarta.validation.constraints.NotNull;

public final class RolePermissionDtos {
    private RolePermissionDtos() {
    }

    public record Request(
            @NotNull Long roleId,
            @NotNull Long permissionId
    ) {
    }

    public record Response(
            Long roleId,
            Long permissionId
    ) {
    }
}

