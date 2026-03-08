package com.campusconnect.controller.component2;

import com.campusconnect.dto.component2.SemesterDtos;
import com.campusconnect.service.component2.SemesterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component2/semesters")
@RequiredArgsConstructor
public class SemesterController {
    private final SemesterService semesterService;

    @PostMapping
    public SemesterDtos.Response create(@Valid @RequestBody SemesterDtos.Request request) {
        return semesterService.create(request);
    }

    @PutMapping("/{semesterId}")
    public SemesterDtos.Response update(@PathVariable Long semesterId, @Valid @RequestBody SemesterDtos.Request request) {
        return semesterService.update(semesterId, request);
    }

    @GetMapping("/{semesterId}")
    public SemesterDtos.Response getById(@PathVariable Long semesterId) {
        return semesterService.getById(semesterId);
    }

    @GetMapping
    public List<SemesterDtos.Response> getAll() {
        return semesterService.getAll();
    }

    @DeleteMapping("/{semesterId}")
    public void delete(@PathVariable Long semesterId) {
        semesterService.delete(semesterId);
    }
}

