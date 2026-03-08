package com.campusconnect.service.component1;

import com.campusconnect.dto.component1.RolePermissionDtos;

import java.util.List;

public interface RolePermissionService {
    RolePermissionDtos.Response create(RolePermissionDtos.Request request);

    RolePermissionDtos.Response getById(Long roleId, Long permissionId);

    List<RolePermissionDtos.Response> getAll();

    void delete(Long roleId, Long permissionId);
}

