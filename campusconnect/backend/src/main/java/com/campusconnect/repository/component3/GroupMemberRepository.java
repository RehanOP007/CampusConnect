package com.campusconnect.repository.component3;

import com.campusconnect.entity.component3.GroupMember;
import com.campusconnect.entity.component3.GroupMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMemberId> {
}

