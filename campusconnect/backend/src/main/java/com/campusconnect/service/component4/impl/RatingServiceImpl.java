package com.campusconnect.service.component4.impl;

import com.campusconnect.dto.component4.RatingDtos;
import com.campusconnect.dto.component4.RecommendationDtos;
import com.campusconnect.entity.component1.User;
import com.campusconnect.entity.component4.*;
import com.campusconnect.repository.component1.UserRepository;
import com.campusconnect.repository.component4.RatingRepository;
import com.campusconnect.repository.component4.EntityRatingSummaryRepository;
import com.campusconnect.service.component4.RatingService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final EntityRatingSummaryRepository summaryRepository;

    // ================= CREATE OR UPDATE =================
    @Override
    public RatingDtos.Response createOrUpdate(RatingDtos.Request request) {

        // ✅ Validate rating
        if (request.ratingValue() < 1 || request.ratingValue() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }

        // ✅ Convert ENUM safely
        Rating.RatingType type = request.entityType();

        // ✅ Get user
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // ✅ Check existing rating
        Rating rating = ratingRepository
                .findByUser_UserIdAndEntityTypeAndEntityId(
                        request.userId(),
                        type,
                        request.entityId()
                )
                .orElse(null);

        if (rating == null) {
            rating = new Rating();
            rating.setCreatedAt(LocalDateTime.now());
        }

        // Always update timestamp
        rating.setUpdatedAt(LocalDateTime.now());

        rating.setEntityType(type);
        rating.setEntityId(request.entityId());
        rating.setRatingValue(request.ratingValue());
        rating.setComment(request.comment());
        rating.setUser(user);

        Rating saved = ratingRepository.save(rating);

        // ✅ Update summary
        updateSummary(type, request.entityId());

        return toResponse(saved);
    }

    // ================= SUMMARY UPDATE =================
    private void updateSummary(Rating.RatingType type, Long entityId) {

    EntityRatingSummaryId id = new EntityRatingSummaryId(type, entityId);

    Object resultObj = ratingRepository.getSummary(type, entityId);

    double avg = 0.0;
    long count = 0;

    if (resultObj != null) {
        Object[] tuple;

        // 🔥 Handle BOTH cases
        if (resultObj instanceof Object[]) {
            tuple = (Object[]) resultObj;
        } else {
            tuple = new Object[]{ resultObj };
        }

        if (tuple.length > 0 && tuple[0] != null) {
            avg = ((Number) tuple[0]).doubleValue();
        }

        if (tuple.length > 1 && tuple[1] != null) {
            count = ((Number) tuple[1]).longValue();
        }
    }

    EntityRatingSummary summary = summaryRepository
            .findById(id)
            .orElse(new EntityRatingSummary(id, 0.0, 0));

    summary.setAverageRating(avg);
    summary.setTotalRatings((int) count);

    summaryRepository.save(summary);
}

    // ================= GET BY ID =================
    @Override
    public RatingDtos.Response getById(Long ratingId) {
        return ratingRepository.findById(ratingId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));
    }

    // ================= GET BY ENTITY =================
    @Override
    public List<RatingDtos.Response> getByEntity(Rating.RatingType entityType, Long entityId) {

        return ratingRepository
                .findByEntityTypeAndEntityId(entityType, entityId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ================= GET BY USER =================
    @Override
    public List<RatingDtos.Response> getByUser(Long userId) {
        return ratingRepository
                .findByUser_UserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ================= GET ALL =================
    @Override
    public List<RatingDtos.Response> getAll() {
        return ratingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ================= DELETE =================
    @Override
    public void delete(Long ratingId) {

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));

        ratingRepository.delete(rating);

        // ✅ Update summary after delete
        updateSummary(rating.getEntityType(), rating.getEntityId());
    }

    @Override
    public Map<String, Object> getSummary(Rating.RatingType type, Long entityId) {

            EntityRatingSummaryId id = new EntityRatingSummaryId(type, entityId);

        EntityRatingSummary summary = summaryRepository.findById(id)
                .orElse(null);

        if (summary == null) {
            return Map.of(
                    "averageRating", 0.0,
                    "totalRatings", 0
            );
        }

        return Map.of(
                "averageRating", summary.getAverageRating(),
                "totalRatings", summary.getTotalRatings()
        );
    }

    @Override
    public List<RecommendationDtos> getTopResourcesBySubject(Long subjectId) {

        List<Object[]> results = ratingRepository.findTopResourcesBySubject(subjectId);

        return results.stream()
            .map(r -> new RecommendationDtos(
                Rating.RatingType.RESOURCE,
                ((Number) r[0]).longValue(), // resourceId
                ((Number) r[1]).doubleValue(),
                ((Number) r[2]).longValue()
            ))
            .toList();
    }

    @Override
    public List<RecommendationDtos> getTopSubjectsBySemester(Long semesterId) {

        return ratingRepository.findTopSubjectsBySemester(semesterId)
                .stream()
                .map(r -> new RecommendationDtos(
                        Rating.RatingType.SUBJECT,
                        ((Number) r[0]).longValue(),
                        ((Number) r[1]).doubleValue(),
                        ((Number) r[2]).longValue()
                ))
                .toList();
    }

    // ================= MAPPER =================
    private RatingDtos.Response toResponse(Rating r) {
        return new RatingDtos.Response(
                r.getRatingId(),
                r.getEntityType(),
                r.getEntityId(),
                r.getRatingValue(),
                r.getComment(),
                r.getCreatedAt(),
                r.getUpdatedAt(),
                r.getUser().getUserId()
        );
    }
}