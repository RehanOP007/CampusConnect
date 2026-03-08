package com.campusconnect.service.component1;

import com.campusconnect.dto.component1.PermissionDtos;

import java.util.List;

public interface PermissionService {
    PermissionDtos.Response create(PermissionDtos.Request request);

    PermissionDtos.Response update(Long permissionId, PermissionDtos.Request request);

    PermissionDtos.Response getById(Long permissionId);

    List<PermissionDtos.Response> getAll();

    void delete(Long permissionId);
}

