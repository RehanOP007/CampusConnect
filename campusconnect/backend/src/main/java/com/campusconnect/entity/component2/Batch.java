package com.campusconnect.entity.component2;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(
    name = "batch",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"campus_id", "intake_year", "intake_month"})
    }
)
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long batchId;

    private Integer intakeYear;

    private String intakeMonth;

    private String batchName;

    private String status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "campus_id")
    private Campus campus;

    @ManyToOne
    @JoinColumn(name = "curriculum_id")
    private Curriculum curriculum;
}
