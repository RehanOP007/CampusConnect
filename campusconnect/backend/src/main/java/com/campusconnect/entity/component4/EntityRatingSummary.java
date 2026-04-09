package com.campusconnect.entity.component4;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "entity_rating_summary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntityRatingSummary {

    @EmbeddedId
    private EntityRatingSummaryId id;

    @Column(nullable = false)
    private Double averageRating;

    @Column(nullable = false)
    private Integer totalRatings;
}
