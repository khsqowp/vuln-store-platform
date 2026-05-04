package com.vulshop.domain.coupon.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.coupon.dto.CouponResponse;
import com.vulshop.domain.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/validate")
    public ApiResponse<CouponResponse> validateCoupon(@RequestParam String code) {
        // 취약점 36 (Enumeration): 인증 없이 쿠폰 코드 유효성을 조회 가능
        return ApiResponse.ok(couponService.validateCoupon(code));
    }
}
