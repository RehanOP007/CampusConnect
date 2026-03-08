package com.campusconnect.service.component1.impl;

import com.campusconnect.dto.component1.ActivityLogDtos;
import com.campusconnect.entity.component1.ActivityLog;
import com.campusconnect.entity.component1.User;
import com.campusconnect.repository.component1.ActivityLogRepository;
import com.campusconnect.repository.component1.UserRepository;
import com.campusconnect.service.component1.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Override
    public ActivityLogDtos.Response create(ActivityLogDtos.Request request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + request.userId()));

        ActivityLog log = new ActivityLog();
        log.setActionType(request.actionType());
        log.setDescription(request.description());
        log.setTimestamp(request.timestamp() == null ? LocalDateTime.now() : request.timestamp());
        log.setUser(user);
        return toResponse(activityLogRepository.save(log));
    }

    @Override
    public ActivityLogDtos.Response update(Long logId, ActivityLogDtos.Request request) {
        ActivityLog log = activityLogRepository.findById(logId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ActivityLog not found: " + logId));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + request.userId()));

        log.setActionType(request.actionType());
        log.setDescription(request.description());
        log.setTimestamp(request.timestamp() == null ? log.getTimestamp() : request.timestamp());
        log.setUser(user);
        return toResponse(activityLogRepository.save(log));
    }

    @Override
    public ActivityLogDtos.Response getById(Long logId) {
        return activityLogRepository.findById(logId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ActivityLog not found: " + logId));
    }

    @Override
    public List<ActivityLogDtos.Response> getAll() {
        return activityLogRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long logId) {
        if (!activityLogRepository.existsById(logId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ActivityLog not found: " + logId);
        }
        activityLogRepository.deleteById(logId);
    }

    private ActivityLogDtos.Response toResponse(ActivityLog log) {
        return new ActivityLogDtos.Response(
                log.getLogId(),
                log.getActionType(),
                log.getDescription(),
                log.getTimestamp(),
                log.getUser() == null ? null : log.getUser().getUserId()
        );
    }
}

