package com.campusconnect.controller.component2;

import com.campusconnect.dto.component2.SubjectDtos;
import com.campusconnect.service.component2.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component2/subjects")
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService subjectService;

    @PostMapping
    public SubjectDtos.Response create(@Valid @RequestBody SubjectDtos.Request request) {
        return subjectService.create(request);
    }

    @PutMapping("/{subjectId}")
    public SubjectDtos.Response update(@PathVariable Long subjectId, @Valid @RequestBody SubjectDtos.Request request) {
        return subjectService.update(subjectId, request);
    }

    @GetMapping("/{subjectId}")
    public SubjectDtos.Response getById(@PathVariable Long subjectId) {
        return subjectService.getById(subjectId);
    }

    @GetMapping
    public List<SubjectDtos.Response> getAll() {
        return subjectService.getAll();
    }

    @DeleteMapping("/{subjectId}")
    public void delete(@PathVariable Long subjectId) {
        subjectService.delete(subjectId);
    }
}

