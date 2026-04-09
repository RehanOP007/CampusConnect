package com.campusconnect.repository.component2;

import com.campusconnect.entity.component2.Program;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByFaculty_FacultyId(Long facultyId);
}

