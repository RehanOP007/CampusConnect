package com.campusconnect.dto.component3;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class GroupMemberDtos {
    private GroupMemberDtos() {
    }

    public record Request(
            @NotNull Long groupId,
            @NotNull Long userId,
            LocalDateTime joinedAt
    ) {
    }

    public record Response(
            Long groupId,
            Long userId,
            LocalDateTime joinedAt
    ) {
    }
}

