package com.campusconnect.service.component1.impl;

import com.campusconnect.dto.component1.PermissionDtos;
import com.campusconnect.entity.component1.Permission;
import com.campusconnect.repository.component1.PermissionRepository;
import com.campusconnect.service.component1.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {
    private final PermissionRepository permissionRepository;

    @Override
    public PermissionDtos.Response create(PermissionDtos.Request request) {
        Permission permission = new Permission();
        permission.setPermissionName(request.permissionName());
        permission.setDescription(request.description());
        return toResponse(permissionRepository.save(permission));
    }

    @Override
    public PermissionDtos.Response update(Long permissionId, PermissionDtos.Request request) {
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found: " + permissionId));

        permission.setPermissionName(request.permissionName());
        permission.setDescription(request.description());
        return toResponse(permissionRepository.save(permission));
    }

    @Override
    public PermissionDtos.Response getById(Long permissionId) {
        return permissionRepository.findById(permissionId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found: " + permissionId));
    }

    @Override
    public List<PermissionDtos.Response> getAll() {
        return permissionRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long permissionId) {
        if (!permissionRepository.existsById(permissionId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found: " + permissionId);
        }
        permissionRepository.deleteById(permissionId);
    }

    private PermissionDtos.Response toResponse(Permission permission) {
        return new PermissionDtos.Response(
                permission.getPermissionId(),
                permission.getPermissionName(),
                permission.getDescription()
        );
    }
}

