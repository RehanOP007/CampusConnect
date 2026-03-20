package com.campusconnect.service.component1.impl;

import com.campusconnect.dto.component1.BatchRepRequestDtos;
import com.campusconnect.entity.component1.BatchRepRequest;
import com.campusconnect.entity.component1.User;
import com.campusconnect.repository.component1.BatchRepRequestRepository;
import com.campusconnect.repository.component1.UserRepository;
import com.campusconnect.service.component1.BatchRepRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchRepRequestServiceImpl implements BatchRepRequestService {

    private final BatchRepRequestRepository requestRepository;
    private final UserRepository userRepository;

    @Override
    public List<BatchRepRequestDtos.Response> getPendingRequests() {

        return requestRepository.findByStatus("PENDING")
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BatchRepRequestDtos.Response approveRequest(Long requestId) {

        BatchRepRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Request not found"));

        User user = request.getUser();

        long count = userRepository
                .countByBatch_BatchIdAndRole_RoleName(
                        request.getBatch().getBatchId(),
                        "BATCHREP"
                );

        if(count >= 4){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Maximum BatchReps already assigned");
        }

        user.setStatus("ACTIVE");
        userRepository.save(user);

        request.setStatus("APPROVED");
        requestRepository.save(request);

        return toResponse(request);
    }

    @Override
    public BatchRepRequestDtos.Response rejectRequest(Long requestId) {

        BatchRepRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Request not found"));

       User user = request.getUser();
        user.setStatus("REJECTED");
        userRepository.save(user);

        requestRepository.save(request);

        return toResponse(request);
    }

    private BatchRepRequestDtos.Response toResponse(BatchRepRequest request){

        return new BatchRepRequestDtos.Response(
                request.getRequestId(),
                request.getUser().getUserId(),
                request.getUser().getUsername(),
                request.getBatch().getBatchId(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}
