package com.campusconnect.repository.component2;

import com.campusconnect.entity.component2.Semester;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    List<Semester> findByBatch_BatchId(Long batchId);
}

