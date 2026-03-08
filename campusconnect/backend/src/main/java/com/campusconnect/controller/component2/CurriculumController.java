package com.campusconnect.controller.component2;

import com.campusconnect.dto.component2.CurriculumDtos;
import com.campusconnect.service.component2.CurriculumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component2/curriculums")
@RequiredArgsConstructor
public class CurriculumController {
    private final CurriculumService curriculumService;

    @PostMapping
    public CurriculumDtos.Response create(@Valid @RequestBody CurriculumDtos.Request request) {
        return curriculumService.create(request);
    }

    @PutMapping("/{curriculumId}")
    public CurriculumDtos.Response update(@PathVariable Long curriculumId, @Valid @RequestBody CurriculumDtos.Request request) {
        return curriculumService.update(curriculumId, request);
    }

    @GetMapping("/{curriculumId}")
    public CurriculumDtos.Response getById(@PathVariable Long curriculumId) {
        return curriculumService.getById(curriculumId);
    }

    @GetMapping
    public List<CurriculumDtos.Response> getAll() {
        return curriculumService.getAll();
    }

    @DeleteMapping("/{curriculumId}")
    public void delete(@PathVariable Long curriculumId) {
        curriculumService.delete(curriculumId);
    }
}

