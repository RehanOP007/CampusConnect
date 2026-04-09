package com.campusconnect.repository.component2;

import com.campusconnect.entity.component2.Faculty;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    List<Faculty> findByCampus_CampusId(Long campusId);
}