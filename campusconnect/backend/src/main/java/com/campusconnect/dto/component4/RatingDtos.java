package com.campusconnect.dto.component4;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

import com.campusconnect.entity.component4.Rating;

public final class RatingDtos {
    private RatingDtos() {}

    public record Request(
            @NotNull Rating.RatingType entityType,   // SUBJECT / SESSION / GROUP / RESOURCE
            @NotNull Long entityId,
            @NotNull @Min(1) @Max(5) Integer ratingValue,
            String comment,
            @NotNull Long userId
    ) {}

    public record Response(
            Long ratingId,
            Rating.RatingType entityType,
            Long entityId,
            Integer ratingValue,
            String comment,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Long userId
    ) {}
}
