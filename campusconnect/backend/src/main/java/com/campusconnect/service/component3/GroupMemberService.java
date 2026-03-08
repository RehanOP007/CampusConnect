package com.campusconnect.service.component3;

import com.campusconnect.dto.component3.GroupMemberDtos;

import java.util.List;

public interface GroupMemberService {
    GroupMemberDtos.Response create(GroupMemberDtos.Request request);

    GroupMemberDtos.Response update(Long groupId, Long userId, GroupMemberDtos.Request request);

    GroupMemberDtos.Response getById(Long groupId, Long userId);

    List<GroupMemberDtos.Response> getAll();

    void delete(Long groupId, Long userId);
}

