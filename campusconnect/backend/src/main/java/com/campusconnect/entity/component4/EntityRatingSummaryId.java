package com.campusconnect.entity.component4;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class EntityRatingSummaryId implements Serializable {

    @Enumerated(EnumType.STRING)
    private Rating.RatingType entityType;
    
    private Long entityId;
}
