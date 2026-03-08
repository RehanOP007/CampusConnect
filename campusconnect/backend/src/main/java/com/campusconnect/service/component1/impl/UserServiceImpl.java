package com.campusconnect.service.component1.impl;

import com.campusconnect.dto.component1.UserDtos;
import com.campusconnect.entity.component1.Role;
import com.campusconnect.entity.component1.User;
import com.campusconnect.entity.component2.Batch;
import com.campusconnect.repository.component1.RoleRepository;
import com.campusconnect.repository.component1.UserRepository;
import com.campusconnect.repository.component2.BatchRepository;
import com.campusconnect.service.component1.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BatchRepository batchRepository;

    @Override
    public UserDtos.Response create(UserDtos.Request request) {
        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found: " + request.roleId()));

        Batch batch = batchRepository.findById(request.batchId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found: " + request.batchId()));

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setStatus(request.status());
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(role);
        user.setBatch(batch);
        return toResponse(userRepository.save(user));
    }

    @Override
    public UserDtos.Response update(Long userId, UserDtos.Request request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found: " + request.roleId()));

        Batch batch = batchRepository.findById(request.batchId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found: " + request.batchId()));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setStatus(request.status());
        user.setRole(role);
        user.setBatch(batch);
        return toResponse(userRepository.save(user));
    }

    @Override
    public UserDtos.Response getById(Long userId) {
        return userRepository.findById(userId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));
    }

    @Override
    public List<UserDtos.Response> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId);
        }
        userRepository.deleteById(userId);
    }

    private UserDtos.Response toResponse(User user) {
        Long roleId = user.getRole() == null || user.getRole().getRoleId() == null ? null : user.getRole().getRoleId().longValue();
        return new UserDtos.Response(
                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getStatus(),
                user.getCreatedAt(),
                roleId,
                user.getBatch() == null ? null : user.getBatch().getBatchId()
        );
    }
}

