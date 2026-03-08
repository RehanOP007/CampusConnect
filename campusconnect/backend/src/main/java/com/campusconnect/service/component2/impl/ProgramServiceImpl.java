package com.campusconnect.service.component2.impl;

import com.campusconnect.dto.component2.ProgramDtos;
import com.campusconnect.entity.component2.Program;
import com.campusconnect.repository.component2.ProgramRepository;
import com.campusconnect.service.component2.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {
    private final ProgramRepository programRepository;

    @Override
    public ProgramDtos.Response create(ProgramDtos.Request request) {
        Program program = new Program();
        program.setProgramName(request.programName());
        program.setFacultyName(request.facultyName());
        program.setDurationYears(request.durationYears());
        program.setStatus(request.status());
        return toResponse(programRepository.save(program));
    }

    @Override
    public ProgramDtos.Response update(Long programId, ProgramDtos.Request request) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found: " + programId));

        program.setProgramName(request.programName());
        program.setFacultyName(request.facultyName());
        program.setDurationYears(request.durationYears());
        program.setStatus(request.status());
        return toResponse(programRepository.save(program));
    }

    @Override
    public ProgramDtos.Response getById(Long programId) {
        return programRepository.findById(programId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found: " + programId));
    }

    @Override
    public List<ProgramDtos.Response> getAll() {
        return programRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long programId) {
        if (!programRepository.existsById(programId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found: " + programId);
        }
        programRepository.deleteById(programId);
    }

    private ProgramDtos.Response toResponse(Program program) {
        return new ProgramDtos.Response(
                program.getProgramId(),
                program.getProgramName(),
                program.getFacultyName(),
                program.getDurationYears(),
                program.getStatus()
        );
    }
}

