package com.campusconnect.repository.component4;

import com.campusconnect.entity.component4.Rating;

import jakarta.validation.constraints.NotBlank;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByEntityTypeAndEntityId(Rating.RatingType entityType, Long entityId);

    List<Rating> findByUser_UserId(Long userId);

    Optional<Rating> findByUser_UserIdAndEntityTypeAndEntityId(
            Long userId, Rating.RatingType entityType, Long entityId
    );

    @Query("""
    SELECT AVG(r.ratingValue), COUNT(r)
    FROM Rating r
    WHERE r.entityType = :type AND r.entityId = :entityId
    """)
    Object[] getSummary(@Param("type") Rating.RatingType type,
                        @Param("entityId") Long entityId);
}
