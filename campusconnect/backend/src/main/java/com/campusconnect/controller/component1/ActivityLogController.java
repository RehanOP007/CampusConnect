package com.campusconnect.controller.component1;

import com.campusconnect.dto.component1.ActivityLogDtos;
import com.campusconnect.service.component1.ActivityLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component1/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogService activityLogService;

    @PostMapping
    public ActivityLogDtos.Response create(@Valid @RequestBody ActivityLogDtos.Request request) {
        return activityLogService.create(request);
    }

    @PutMapping("/{logId}")
    public ActivityLogDtos.Response update(@PathVariable Long logId, @Valid @RequestBody ActivityLogDtos.Request request) {
        return activityLogService.update(logId, request);
    }

    @GetMapping("/{logId}")
    public ActivityLogDtos.Response getById(@PathVariable Long logId) {
        return activityLogService.getById(logId);
    }

    @GetMapping
    public List<ActivityLogDtos.Response> getAll() {
        return activityLogService.getAll();
    }

    @DeleteMapping("/{logId}")
    public void delete(@PathVariable Long logId) {
        activityLogService.delete(logId);
    }
}

