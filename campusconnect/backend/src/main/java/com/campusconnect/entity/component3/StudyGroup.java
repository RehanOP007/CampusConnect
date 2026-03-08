package com.campusconnect.entity.component3;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.campusconnect.entity.component1.User;
import com.campusconnect.entity.component2.Semester;
import com.campusconnect.entity.component2.Subject;

@Entity
@Table(name = "study_group")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private String groupName;

    private String status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}
