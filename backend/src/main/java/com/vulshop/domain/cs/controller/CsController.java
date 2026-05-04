package com.vulshop.domain.cs.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.cs.dto.InquiryCreateRequest;
import com.vulshop.domain.cs.dto.InquiryResponse;
import com.vulshop.domain.cs.service.CsService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cs")
@RequiredArgsConstructor
public class CsController {

    private final CsService csService;

    @PostMapping("/inquiries")
    public ApiResponse<InquiryResponse> createInquiry(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody InquiryCreateRequest request) {
        return ApiResponse.created(csService.createInquiry(userDetails.getUserId(), request));
    }

    @GetMapping("/inquiries")
    public ApiResponse<List<InquiryResponse>> getMyInquiries(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.ok(csService.getMyInquiries(userDetails.getUserId()));
    }

    @GetMapping("/inquiries/{id}")
    public ApiResponse<InquiryResponse> getInquiry(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        // 취약점 2 (IDOR)
        return ApiResponse.ok(csService.getInquiry(userDetails.getUserId(), id));
    }
}
