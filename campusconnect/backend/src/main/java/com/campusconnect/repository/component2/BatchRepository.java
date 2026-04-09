package com.campusconnect.repository.component2;

import com.campusconnect.entity.component2.Batch;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByCurriculum_CurriculumId(Long curriculumId);
}

