package com.campusconnect.service.component4;

import com.campusconnect.dto.component4.RatingDtos;
import com.campusconnect.entity.component4.Rating;

import java.util.List;

public interface RatingService {

    RatingDtos.Response createOrUpdate(RatingDtos.Request request);

    RatingDtos.Response getById(Long ratingId);

    List<RatingDtos.Response> getByEntity(Rating.RatingType entityType, Long entityId);

    List<RatingDtos.Response> getByUser(Long userId);

    List<RatingDtos.Response> getAll();

    void delete(Long ratingId);
}
