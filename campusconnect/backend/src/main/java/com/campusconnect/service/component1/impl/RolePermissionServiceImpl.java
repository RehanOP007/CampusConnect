package com.campusconnect.service.component1.impl;

import com.campusconnect.dto.component1.RolePermissionDtos;
import com.campusconnect.entity.component1.RolePermission;
import com.campusconnect.entity.component1.RolePermissionId;
import com.campusconnect.repository.component1.RolePermissionRepository;
import com.campusconnect.service.component1.RolePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolePermissionServiceImpl implements RolePermissionService {
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    public RolePermissionDtos.Response create(RolePermissionDtos.Request request) {
        RolePermission rolePermission = new RolePermission();
        rolePermission.setId(new RolePermissionId(request.roleId(), request.permissionId()));
        return toResponse(rolePermissionRepository.save(rolePermission));
    }

    @Override
    public RolePermissionDtos.Response getById(Long roleId, Long permissionId) {
        RolePermissionId id = new RolePermissionId(roleId, permissionId);
        return rolePermissionRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RolePermission not found"));
    }

    @Override
    public List<RolePermissionDtos.Response> getAll() {
        return rolePermissionRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long roleId, Long permissionId) {
        RolePermissionId id = new RolePermissionId(roleId, permissionId);
        if (!rolePermissionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "RolePermission not found");
        }
        rolePermissionRepository.deleteById(id);
    }

    private RolePermissionDtos.Response toResponse(RolePermission rolePermission) {
        if (rolePermission.getId() == null) {
            return new RolePermissionDtos.Response(null, null);
        }
        return new RolePermissionDtos.Response(rolePermission.getId().getRoleId(), rolePermission.getId().getPermissionId());
    }
}

