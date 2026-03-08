package com.campusconnect.repository.component4;

import com.campusconnect.entity.component4.UserInterest;
import com.campusconnect.entity.component4.UserInterestId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInterestRepository extends JpaRepository<UserInterest, UserInterestId> {
}

