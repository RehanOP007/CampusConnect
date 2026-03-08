package com.campusconnect.entity.component2;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "curriculum")
public class Curriculum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long curriculumId;

    private String curriculumName;

    private String version;

    private Integer createdYear;

    private String status;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;
}