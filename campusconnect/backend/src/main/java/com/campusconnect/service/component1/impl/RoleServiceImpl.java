package com.campusconnect.service.component1.impl;

import com.campusconnect.dto.component1.RoleDtos;
import com.campusconnect.entity.component1.Role;
import com.campusconnect.repository.component1.RoleRepository;
import com.campusconnect.service.component1.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public RoleDtos.Response create(RoleDtos.Request request) {
        Role role = new Role();
        role.setRoleName(request.roleName());
        role.setDescription(request.description());
        return toResponse(roleRepository.save(role));
    }

    @Override
    public RoleDtos.Response update(Long roleId, RoleDtos.Request request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found: " + roleId));

        role.setRoleName(request.roleName());
        role.setDescription(request.description());
        return toResponse(roleRepository.save(role));
    }

    @Override
    public RoleDtos.Response getById(Long roleId) {
        return roleRepository.findById(roleId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found: " + roleId));
    }

    @Override
    public List<RoleDtos.Response> getAll() {
        return roleRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long roleId) {
        if (!roleRepository.existsById(roleId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found: " + roleId);
        }
        roleRepository.deleteById(roleId);
    }

    private RoleDtos.Response toResponse(Role role) {
        Long roleId = role.getRoleId() == null ? null : role.getRoleId().longValue();
        return new RoleDtos.Response(roleId, role.getRoleName(), role.getDescription());
    }
}

