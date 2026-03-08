package com.campusconnect.controller.component1;

import com.campusconnect.dto.component1.FeedbackDtos;
import com.campusconnect.service.component1.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component1/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping
    public FeedbackDtos.Response create(@Valid @RequestBody FeedbackDtos.Request request) {
        return feedbackService.create(request);
    }

    @PutMapping("/{feedbackId}")
    public FeedbackDtos.Response update(@PathVariable Long feedbackId, @Valid @RequestBody FeedbackDtos.Request request) {
        return feedbackService.update(feedbackId, request);
    }

    @GetMapping("/{feedbackId}")
    public FeedbackDtos.Response getById(@PathVariable Long feedbackId) {
        return feedbackService.getById(feedbackId);
    }

    @GetMapping
    public List<FeedbackDtos.Response> getAll() {
        return feedbackService.getAll();
    }

    @DeleteMapping("/{feedbackId}")
    public void delete(@PathVariable Long feedbackId) {
        feedbackService.delete(feedbackId);
    }
}

