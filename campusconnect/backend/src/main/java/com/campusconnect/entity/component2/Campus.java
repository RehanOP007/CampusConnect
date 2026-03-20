package com.campusconnect.entity.component2;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "campus")
public class Campus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campusId;

    private String campusName;

    private String location;

    private String mailDomain;

    private String status;
}
