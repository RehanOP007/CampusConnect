package com.campusconnect.service.component1;

import com.campusconnect.dto.component1.BatchRepRequestDtos;

import java.util.List;

public interface BatchRepRequestService {

    List<BatchRepRequestDtos.Response> getPendingRequests();

    BatchRepRequestDtos.Response approveRequest(Long requestId);

    BatchRepRequestDtos.Response rejectRequest(Long requestId);

}
 