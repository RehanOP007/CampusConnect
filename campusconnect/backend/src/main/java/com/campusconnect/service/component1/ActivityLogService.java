package com.campusconnect.service.component1;

import com.campusconnect.dto.component1.ActivityLogDtos;

import java.util.List;

public interface ActivityLogService {
    ActivityLogDtos.Response create(ActivityLogDtos.Request request);

    ActivityLogDtos.Response update(Long logId, ActivityLogDtos.Request request);

    ActivityLogDtos.Response getById(Long logId);

    List<ActivityLogDtos.Response> getAll();

    void delete(Long logId);
}

