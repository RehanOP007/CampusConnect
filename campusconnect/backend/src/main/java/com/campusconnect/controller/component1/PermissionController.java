package com.campusconnect.controller.component1;

import com.campusconnect.dto.component1.PermissionDtos;
import com.campusconnect.service.component1.PermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component1/permissions")
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @PostMapping
    public PermissionDtos.Response create(@Valid @RequestBody PermissionDtos.Request request) {
        return permissionService.create(request);
    }

    @PutMapping("/{permissionId}")
    public PermissionDtos.Response update(@PathVariable Long permissionId, @Valid @RequestBody PermissionDtos.Request request) {
        return permissionService.update(permissionId, request);
    }

    @GetMapping("/{permissionId}")
    public PermissionDtos.Response getById(@PathVariable Long permissionId) {
        return permissionService.getById(permissionId);
    }

    @GetMapping
    public List<PermissionDtos.Response> getAll() {
        return permissionService.getAll();
    }

    @DeleteMapping("/{permissionId}")
    public void delete(@PathVariable Long permissionId) {
        permissionService.delete(permissionId);
    }
}

