package com.vulshop.domain.review.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.review.dto.ReviewCreateRequest;
import com.vulshop.domain.review.dto.ReviewResponse;
import com.vulshop.domain.review.service.ReviewService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ApiResponse<List<ReviewResponse>> getReviews(@RequestParam Long productId) {
        return ApiResponse.ok(reviewService.getReviewsByProduct(productId));
    }

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("data") ReviewCreateRequest request,
            // 취약점 26: 업로드된 파일의 Content-Type, Magic Number 검증 없음
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        return ApiResponse.created(reviewService.createReview(userDetails.getUserId(), request, imageFile));
    }
}
