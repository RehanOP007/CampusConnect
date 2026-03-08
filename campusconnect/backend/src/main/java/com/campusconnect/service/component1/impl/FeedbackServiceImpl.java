package com.campusconnect.service.component1.impl;

import com.campusconnect.dto.component1.FeedbackDtos;
import com.campusconnect.entity.component1.Feedback;
import com.campusconnect.entity.component1.User;
import com.campusconnect.repository.component1.FeedbackRepository;
import com.campusconnect.repository.component1.UserRepository;
import com.campusconnect.service.component1.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Override
    public FeedbackDtos.Response create(FeedbackDtos.Request request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + request.userId()));

        Feedback feedback = new Feedback();
        feedback.setFeedbackType(request.feedbackType());
        feedback.setMessage(request.message());
        feedback.setStatus(request.status());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUser(user);
        return toResponse(feedbackRepository.save(feedback));
    }

    @Override
    public FeedbackDtos.Response update(Long feedbackId, FeedbackDtos.Request request) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found: " + feedbackId));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + request.userId()));

        feedback.setFeedbackType(request.feedbackType());
        feedback.setMessage(request.message());
        feedback.setStatus(request.status());
        feedback.setUser(user);
        return toResponse(feedbackRepository.save(feedback));
    }

    @Override
    public FeedbackDtos.Response getById(Long feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found: " + feedbackId));
    }

    @Override
    public List<FeedbackDtos.Response> getAll() {
        return feedbackRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found: " + feedbackId);
        }
        feedbackRepository.deleteById(feedbackId);
    }

    private FeedbackDtos.Response toResponse(Feedback feedback) {
        return new FeedbackDtos.Response(
                feedback.getFeedbackId(),
                feedback.getFeedbackType(),
                feedback.getMessage(),
                feedback.getStatus(),
                feedback.getCreatedAt(),
                feedback.getUser() == null ? null : feedback.getUser().getUserId()
        );
    }
}

