package com.campusconnect.repository.component1;

import com.campusconnect.entity.component1.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Number> {
}

