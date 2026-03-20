package com.campusconnect.repository.component2;

import com.campusconnect.entity.component2.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampusRepository extends JpaRepository<Campus, Long> {
    // Check if a campus with the given name already exists
    boolean existsByCampusName(String campusName);
    Campus findByCampusName(String campusName);
}