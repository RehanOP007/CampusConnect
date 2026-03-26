package com.campusconnect.controller.component1;

import com.campusconnect.dto.component1.RoleDtos;
import com.campusconnect.service.component1.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/create")
    public RoleDtos.Response create(@Valid @RequestBody RoleDtos.Request request) {
        return roleService.create(request);
    }

    @PutMapping("/update")
    public RoleDtos.Response update(@RequestParam Long roleId, @Valid @RequestBody RoleDtos.Request request) {
        return roleService.update(roleId, request);
    }

    @GetMapping("/getById")
    public RoleDtos.Response getById(@RequestParam Long roleId) {
        return roleService.getById(roleId);
    }

    @GetMapping("/all")
    public List<RoleDtos.Response> getAll() {
        return roleService.getAll();
    }

    @DeleteMapping("/delete")
    public void delete(@RequestParam Long roleId) {
        roleService.delete(roleId);
    }
}

