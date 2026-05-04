package com.vulshop.domain.seller.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.seller.dto.SellerApplyRequest;
import com.vulshop.domain.seller.service.SellerService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @PostMapping("/apply")
    public ApiResponse<Void> apply(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody SellerApplyRequest request) {
        sellerService.apply(userDetails.getUserId(), request);
        return ApiResponse.ok(null);
    }
}
