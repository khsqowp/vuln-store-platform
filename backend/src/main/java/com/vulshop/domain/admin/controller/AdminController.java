package com.vulshop.domain.admin.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.user.dto.UserResponse;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    // 취약점 22 (관리자 페이지 접근 통제 미흡):
    // Spring Security 설정에서 /api/v1/admin/** 경로에 대해 ROLE_ADMIN 권한을 요구하도록
    // 설정되어 있어야 하지만, 실제로는 SecurityConfig에서 누락되거나 느슨하게 설정됨.
    // (이 컨트롤러에 @PreAuthorize 없이, SecurityConfig에서 anyRequest().authenticated()만 걸려 있어
    //  ROLE_USER 토큰을 가진 일반 사용자도 접근 가능한 취약점 시나리오)
    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
        return ApiResponse.ok(users);
    }

    @DeleteMapping("/users/{userId}")
    public ApiResponse<Void> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ApiResponse.ok(null);
    }
}
