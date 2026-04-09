package com.campusconnect.service.component4.impl;

import com.campusconnect.dto.component4.RatingDtos;
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

        // 🔥 Optimized query (AVG + COUNT)
        Object[] result = ratingRepository.getSummary(type, entityId);

        double avg = result[0] != null ? ((Double) result[0]) : 0.0;
        long count = result[1] != null ? ((Long) result[1]) : 0;

        if (count == 0) {
            summaryRepository.deleteById(id);
            return;
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