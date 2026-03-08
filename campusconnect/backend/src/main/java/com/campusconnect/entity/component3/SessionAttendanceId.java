package com.campusconnect.entity.component3;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class SessionAttendanceId implements Serializable {

    private Long sessionId;
    private Long userId;
}
