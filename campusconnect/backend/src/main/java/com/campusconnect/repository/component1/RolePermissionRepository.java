package com.campusconnect.repository.component1;

import com.campusconnect.entity.component1.RolePermission;
import com.campusconnect.entity.component1.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {
}

