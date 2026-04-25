package com.campusconnect.controller.component2;

import com.campusconnect.dto.component2.FacultyDtos;
import com.campusconnect.service.component2.FacultyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculties")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/create")
    public FacultyDtos.Response create(@Valid @RequestBody FacultyDtos.Request request) {
        return facultyService.create(request);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/update")
    public FacultyDtos.Response update(
            @RequestParam Long id,
            @Valid @RequestBody FacultyDtos.Request request
    ) {
        return facultyService.update(id, request);
    }

    @GetMapping("/get")
    public FacultyDtos.Response getById(@RequestParam Long id) {
        return facultyService.getById(id);
    }

    @GetMapping("/getByCampus")
    public List<FacultyDtos.Response> getByCampuList(@RequestParam Long id) {
        return facultyService.getByCampusId(id);
    }

    @GetMapping("/all")
    public List<FacultyDtos.Response> getAll() {
        return facultyService.getAll();
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/delete")
    public void delete(@RequestParam Long id) {
        facultyService.delete(id);
    }
}