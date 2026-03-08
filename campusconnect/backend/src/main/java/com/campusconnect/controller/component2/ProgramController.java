package com.campusconnect.controller.component2;

import com.campusconnect.dto.component2.ProgramDtos;
import com.campusconnect.service.component2.ProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component2/programs")
@RequiredArgsConstructor
public class ProgramController {
    private final ProgramService programService;

    @PostMapping
    public ProgramDtos.Response create(@Valid @RequestBody ProgramDtos.Request request) {
        return programService.create(request);
    }

    @PutMapping("/{programId}")
    public ProgramDtos.Response update(@PathVariable Long programId, @Valid @RequestBody ProgramDtos.Request request) {
        return programService.update(programId, request);
    }

    @GetMapping("/{programId}")
    public ProgramDtos.Response getById(@PathVariable Long programId) {
        return programService.getById(programId);
    }

    @GetMapping
    public List<ProgramDtos.Response> getAll() {
        return programService.getAll();
    }

    @DeleteMapping("/{programId}")
    public void delete(@PathVariable Long programId) {
        programService.delete(programId);
    }
}

