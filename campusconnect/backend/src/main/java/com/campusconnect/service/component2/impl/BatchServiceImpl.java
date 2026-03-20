package com.campusconnect.service.component2.impl;

import com.campusconnect.dto.component2.BatchDtos;
import com.campusconnect.entity.component2.Batch;
import com.campusconnect.entity.component2.Campus;
import com.campusconnect.entity.component2.Curriculum;
import com.campusconnect.repository.component2.BatchRepository;
import com.campusconnect.repository.component2.CampusRepository;
import com.campusconnect.repository.component2.CurriculumRepository;
import com.campusconnect.service.component2.BatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {
    private final BatchRepository batchRepository;
    private final CampusRepository campusRepository;
    private final CurriculumRepository curriculumRepository;

    @Override
    public BatchDtos.Response create(BatchDtos.Request request) {
        Campus campus = campusRepository.findById(request.campusId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campus not found: " + request.campusId()));

        Curriculum curriculum = null;

        if (request.curriculumId() != null) {
            curriculum = curriculumRepository.findById(request.curriculumId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, 
                            "Curriculum not found: " + request.curriculumId()
                    ));
        }

        Batch batch = new Batch();
        batch.setIntakeYear(request.intakeYear());
        batch.setIntakeMonth(request.intakeMonth());
        batch.setBatchName(request.batchName());
        batch.setStatus(request.status());
        batch.setCampus(campus);
        batch.setCurriculum(curriculum);
        batch.setCreatedAt(LocalDateTime.now());
        return toResponse(batchRepository.save(batch));
    }

    @Override
    public BatchDtos.Response update(Long batchId, BatchDtos.Request request) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found: " + batchId));

        Campus campus = campusRepository.findById(request.campusId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campus not found: " + request.campusId()));

        Curriculum curriculum = null;

        if (request.curriculumId() != null) {
            curriculum = curriculumRepository.findById(request.curriculumId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Curriculum not found: " + request.curriculumId()
                    ));
        }

        batch.setIntakeYear(request.intakeYear());
        batch.setIntakeMonth(request.intakeMonth());
        batch.setStatus(request.status());
        batch.setCampus(campus);
        batch.setCurriculum(curriculum);
        return toResponse(batchRepository.save(batch));
    }

    @Override
    public BatchDtos.Response getById(Long batchId) {
        return batchRepository.findById(batchId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found: " + batchId));
    }

    @Override
    public List<BatchDtos.Response> getAll() {
        return batchRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long batchId) {
        if (!batchRepository.existsById(batchId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found: " + batchId);
        }
        batchRepository.deleteById(batchId);
    }

    private BatchDtos.Response toResponse(Batch batch) {
        return new BatchDtos.Response(
                batch.getBatchId(),
                batch.getBatchName(),
                batch.getIntakeYear(),
                batch.getIntakeMonth(),
                batch.getStatus(),
                batch.getCreatedAt(),
                batch.getCampus() == null ? null : batch.getCampus().getCampusId(),
                batch.getCurriculum() == null ? null : batch.getCurriculum().getCurriculumId()
        );
    }
}

