package com.campusconnect.controller.component1;

import com.campusconnect.dto.component1.RolePermissionDtos;
import com.campusconnect.service.component1.RolePermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component1/role-permissions")
@RequiredArgsConstructor
public class RolePermissionController {
    private final RolePermissionService rolePermissionService;

    @PostMapping
    public RolePermissionDtos.Response create(@Valid @RequestBody RolePermissionDtos.Request request) {
        return rolePermissionService.create(request);
    }

    @GetMapping("/{roleId}/{permissionId}")
    public RolePermissionDtos.Response getById(@PathVariable Long roleId, @PathVariable Long permissionId) {
        return rolePermissionService.getById(roleId, permissionId);
    }

    @GetMapping
    public List<RolePermissionDtos.Response> getAll() {
        return rolePermissionService.getAll();
    }

    @DeleteMapping("/{roleId}/{permissionId}")
    public void delete(@PathVariable Long roleId, @PathVariable Long permissionId) {
        rolePermissionService.delete(roleId, permissionId);
    }
}

