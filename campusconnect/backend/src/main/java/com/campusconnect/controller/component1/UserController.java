package com.campusconnect.controller.component1;

import com.campusconnect.dto.component1.UserDtos;
import com.campusconnect.service.component1.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/component1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public UserDtos.Response create(@Valid @RequestBody UserDtos.Request request) {
        return userService.create(request);
    }

    @PutMapping("/{userId}")
    public UserDtos.Response update(@PathVariable Long userId, @Valid @RequestBody UserDtos.Request request) {
        return userService.update(userId, request);
    }

    @GetMapping("/{userId}")
    public UserDtos.Response getById(@PathVariable Long userId) {
        return userService.getById(userId);
    }

    @GetMapping
    public List<UserDtos.Response> getAll() {
        return userService.getAll();
    }

    @DeleteMapping("/{userId}")
    public void delete(@PathVariable Long userId) {
        userService.delete(userId);
    }
}

