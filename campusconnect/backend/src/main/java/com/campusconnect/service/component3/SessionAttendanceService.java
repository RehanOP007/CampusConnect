package com.campusconnect.service.component3;

import com.campusconnect.dto.component3.SessionAttendanceDtos;

import java.util.List;

public interface SessionAttendanceService {
    SessionAttendanceDtos.Response create(SessionAttendanceDtos.Request request);

    SessionAttendanceDtos.Response update(Long sessionId, Long userId, SessionAttendanceDtos.Request request);

    SessionAttendanceDtos.Response getById(Long sessionId, Long userId);

    List<SessionAttendanceDtos.Response> getAll();

    void delete(Long sessionId, Long userId);
}

