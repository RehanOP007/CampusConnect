package com.campusconnect.service.component1;

import com.campusconnect.dto.component1.RoleDtos;

import java.util.List;

public interface RoleService {
    RoleDtos.Response create(RoleDtos.Request request);

    RoleDtos.Response update(Long roleId, RoleDtos.Request request);

    RoleDtos.Response getById(Long roleId);

    List<RoleDtos.Response> getAll();

    void delete(Long roleId);
}

