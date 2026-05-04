package com.vulshop.domain.user.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.user.dto.UpdateEmailRequest;
import com.vulshop.domain.user.dto.UserResponse;
import com.vulshop.domain.user.service.UserService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<UserResponse> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.ok(userService.getUserInfo(userDetails.getUserId()));
    }

    @PostMapping("/email")
    public ApiResponse<Void> updateEmail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateEmailRequest request) {
        
        userService.updateEmail(userDetails.getUserId(), request);
        return ApiResponse.ok(null);
    }

    @PostMapping("/profile")
    public ApiResponse<Map<String, String>> updateProfileImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        
        String imageUrl = userService.updateProfileImage(userDetails.getUserId(), file);
        return ApiResponse.ok(Map.of("profileImageUrl", imageUrl));
    }
}
