package com.campusconnect.entity.component1;

import com.campusconnect.entity.component2.Batch;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "batchrep_requests")
public class BatchRepRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

    private String status; // PENDING, APPROVED, REJECTED

    private LocalDateTime createdAt;

}
