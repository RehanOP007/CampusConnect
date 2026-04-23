package com.campusconnect.controller.component1;

import com.campusconnect.dto.component1.FeedbackDtos;
import com.campusconnect.service.component1.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // ===========================
    // 🟢 STUDENT / BATCH_REP
    // ===========================

    // Create feedback
    @PreAuthorize("hasAnyAuthority('STUDENT','BATCH_REP')")
    @PostMapping
    public FeedbackDtos.Response create(@Valid @RequestBody FeedbackDtos.Request request) {
        return feedbackService.create(request);
    }

    // Update feedback (own only handled in service)
    @PreAuthorize("hasAnyAuthority('STUDENT','BATCH_REP')")
    @PutMapping("/{feedbackId}")
    public FeedbackDtos.Response update(@PathVariable Long feedbackId,
                                        @RequestBody FeedbackDtos.Request request) {
        return feedbackService.update(feedbackId, request);
    }

    // Delete feedback (own only handled in service)
    @PreAuthorize("hasAnyAuthority('STUDENT','BATCH_REP')")
    @DeleteMapping("/{feedbackId}")
    public void delete(@PathVariable Long feedbackId) {
        feedbackService.delete(feedbackId);
    }

    // View own feedbacks
    @PreAuthorize("hasAnyAuthority('STUDENT','BATCH_REP','ADMIN')")
    @GetMapping("/user/{userId}")
    public List<FeedbackDtos.Response> getByUser(@PathVariable Long userId) {
        return feedbackService.getByUserId(userId);
    }

    // ===========================
    // 🔵 COMMON (ALL LOGGED USERS)
    // ===========================

    // View single feedback (Admin or owner check in service if needed)
    @GetMapping("/{feedbackId}")
    public FeedbackDtos.Response getById(@PathVariable Long feedbackId) {
        return feedbackService.getById(feedbackId);
    }

    // View feedbacks by session
    @GetMapping("/session/{sessionId}")
    public List<FeedbackDtos.Response> getBySession(@PathVariable Long sessionId) {
        return feedbackService.getBySessionId(sessionId);
    }

    // ===========================
    // 🔴 ADMIN ONLY
    // ===========================

    // View all feedbacks
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public List<FeedbackDtos.Response> getAll() {
        return feedbackService.getAll();
    }

    // Filter by Faculty
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/faculty/{faculty}")
    public List<FeedbackDtos.Response> getByFaculty(@PathVariable String faculty) {
        return feedbackService.getByFaculty(faculty);
    }

    // Filter by Program
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/program/{program}")
    public List<FeedbackDtos.Response> getByProgram(@PathVariable String program) {
        return feedbackService.getByProgram(program);
    }

    // Filter by Program + Year
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/program/{program}/year/{year}")
    public List<FeedbackDtos.Response> getByProgramAndYear(
            @PathVariable String program,
            @PathVariable int year) {
        return feedbackService.getByProgramAndYear(program, year);
    }

    // Filter by Program + Year + Semester
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/program/{program}/year/{year}/semester/{semester}")
    public List<FeedbackDtos.Response> getByProgramYearSemester(
            @PathVariable String program,
            @PathVariable int year,
            @PathVariable int semester) {
        return feedbackService.getByProgramYearAndSemester(program, year, semester);
    }
}