package com.campusconnect.dto.component1;

import java.time.LocalDateTime;

public final class BatchRepRequestDtos {

    private BatchRepRequestDtos(){}

    public record Response(
            Long requestId,
            Long userId,
            String username,
            Long batchId,
            String status,
            LocalDateTime createdAt
    ){}

}
