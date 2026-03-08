package com.campusconnect.entity.component3;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

import com.campusconnect.entity.component1.User;

@Entity
@Table(name = "session")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    private LocalDate sessionDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String locationOrLink;

    private String status;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private StudyGroup studyGroup;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}
