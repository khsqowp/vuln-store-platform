package com.vulshop.domain.community.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.community.dto.PostCreateRequest;
import com.vulshop.domain.community.dto.PostResponse;
import com.vulshop.domain.community.service.CommunityService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/posts")
    public ApiResponse<List<PostResponse>> getPosts() {
        return ApiResponse.ok(communityService.getAllPosts());
    }

    @GetMapping("/posts/{id}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long id) {
        // 취약점 46 (과도 노출)은 Service 계층에서 DTO 변환 시 발생
        return ApiResponse.ok(communityService.getPost(id));
    }

    @PostMapping("/posts")
    public ApiResponse<PostResponse> createPost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody PostCreateRequest request) {
        
        // 취약점 4 (Stored XSS)
        return ApiResponse.created(communityService.createPost(userDetails.getUserId(), request));
    }
}
