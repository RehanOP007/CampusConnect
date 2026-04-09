package com.campusconnect.entity.component4;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

import com.campusconnect.entity.component1.User;

@Entity
@Table(name = "rating")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @Enumerated(EnumType.STRING)
    private RatingType entityType;
    // SUBJECT / SESSION / GROUP / RESOURCE

    private Long entityId;// id of subject/session/group/resource

    private Integer ratingValue;

    private String comment;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public enum RatingType {
    SUBJECT,
    RESOURCE,
    SESSION,
    GROUP
}

}
