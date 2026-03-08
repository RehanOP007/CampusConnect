package com.campusconnect.entity.component4;

import com.campusconnect.entity.component1.User;
import com.campusconnect.entity.component2.Subject;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_interest")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInterest {

    @EmbeddedId
    private UserInterestId id;

    private Double interestScore;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("subjectId")
    @JoinColumn(name = "subject_id")
    private Subject subject;
}
