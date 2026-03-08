package com.campusconnect.repository.component3;

import com.campusconnect.entity.component3.SessionAttendance;
import com.campusconnect.entity.component3.SessionAttendanceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionAttendanceRepository extends JpaRepository<SessionAttendance, SessionAttendanceId> {
}

