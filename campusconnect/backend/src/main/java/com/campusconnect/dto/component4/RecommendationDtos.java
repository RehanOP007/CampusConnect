package com.campusconnect.dto.component4;

import com.campusconnect.entity.component4.Rating;

public record RecommendationDtos(
    Rating.RatingType entityType,
    Long entityId,        // resourceId       // IMPORTANT
    Double avgRating,
    Long totalRatings
) {}
