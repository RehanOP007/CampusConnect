package com.campusconnect.service.component2.impl;

import com.campusconnect.dto.component2.ProgramDtos;
import com.campusconnect.dto.component2.SemesterDtos;
import com.campusconnect.entity.component2.Batch;
import com.campusconnect.entity.component2.Program;
import com.campusconnect.entity.component2.Semester;
import com.campusconnect.repository.component2.BatchRepository;
import com.campusconnect.repository.component2.SemesterRepository;
import com.campusconnect.service.component2.SemesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SemesterServiceImpl implements SemesterService {
    private final SemesterRepository semesterRepository;
    private final BatchRepository batchRepository;

    @Override
    public SemesterDtos.Response create(SemesterDtos.Request request) {
        Batch batch = batchRepository.findById(request.batchId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found: " + request.batchId()));

        Semester semester = new Semester();
        semester.setYearNumber(request.yearNumber());
        semester.setSemesterNumber(request.semesterNumber());
        semester.setStartDate(request.startDate());
        semester.setEndDate(request.endDate());
        semester.setStatus(request.status());
        semester.setBatch(batch);
        return toResponse(semesterRepository.save(semester));
    }

    @Override
    public SemesterDtos.Response update(Long semesterId, SemesterDtos.Request request) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Semester not found: " + semesterId));

        Batch batch = batchRepository.findById(request.batchId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found: " + request.batchId()));

        semester.setYearNumber(request.yearNumber());
        semester.setSemesterNumber(request.semesterNumber());
        semester.setStartDate(request.startDate());
        semester.setEndDate(request.endDate());
        semester.setStatus(request.status());
        semester.setBatch(batch);
        return toResponse(semesterRepository.save(semester));
    }

    @Override
    public SemesterDtos.Response getById(Long semesterId) {
        return semesterRepository.findById(semesterId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Semester not found: " + semesterId));
    }

    @Override
    public List<SemesterDtos.Response> getByBatch(Long batchId) {

        List<Semester> semesters = semesterRepository.findByBatch_BatchId(batchId);

        if (semesters.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No semesters found for batchId: " + batchId
            );
        }

        return semesters.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SemesterDtos.Response> getAll() {
        return semesterRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long semesterId) {
        if (!semesterRepository.existsById(semesterId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Semester not found: " + semesterId);
        }
        semesterRepository.deleteById(semesterId);
    }

    private SemesterDtos.Response toResponse(Semester semester) {
        return new SemesterDtos.Response(
                semester.getSemesterId(),
                semester.getYearNumber(),
                semester.getSemesterNumber(),
                semester.getStartDate(),
                semester.getEndDate(),
                semester.getStatus(),
                semester.getBatch() == null ? null : semester.getBatch().getBatchId()
        );
    }
}

