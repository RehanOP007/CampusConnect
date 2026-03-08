package com.campusconnect.controller.component2;

import com.campusconnect.dto.component2.CampusDtos;
import com.campusconnect.service.component2.CampusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component2/campuses")
@RequiredArgsConstructor
public class CampusController {
    private final CampusService campusService;

    @PostMapping
    public CampusDtos.Response create(@Valid @RequestBody CampusDtos.Request request) {
        return campusService.create(request);
    }

    @PutMapping("/{campusId}")
    public CampusDtos.Response update(@PathVariable Long campusId, @Valid @RequestBody CampusDtos.Request request) {
        return campusService.update(campusId, request);
    }

    @GetMapping("/{campusId}")
    public CampusDtos.Response getById(@PathVariable Long campusId) {
        return campusService.getById(campusId);
    }

    @GetMapping
    public List<CampusDtos.Response> getAll() {
        return campusService.getAll();
    }

    @DeleteMapping("/{campusId}")
    public void delete(@PathVariable Long campusId) {
        campusService.delete(campusId);
    }
}

