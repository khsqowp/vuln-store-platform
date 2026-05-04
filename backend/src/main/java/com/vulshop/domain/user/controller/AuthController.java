package com.vulshop.domain.user.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.user.dto.AuthResponse;
import com.vulshop.domain.user.dto.LoginRequest;
import com.vulshop.domain.user.dto.RegisterRequest;
import com.vulshop.domain.user.dto.UserResponse;
import com.vulshop.domain.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
        return ApiResponse.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(
            @RequestBody LoginRequest request,
            @RequestParam(required = false) String redirect) {
        
        // 취약점 21: 전달받은 redirectUrl 파라미터를 아무런 검증 없이 응답에 포함시킴
        // 프론트엔드는 이 응답을 받아 해당 URL로 강제 이동 (Open Redirect)
        AuthResponse response = authService.login(request, redirect);
        return ApiResponse.ok(response);
    }
}
