package com.vulshop.domain.coupon.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.coupon.dto.CouponResponse;
import com.vulshop.domain.coupon.entity.Coupon;
import com.vulshop.domain.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public CouponResponse validateCoupon(String code) {
        // 취약점 36 (열거 공격/Enumeration): 쿠폰 코드가 존재하지 않으면 "유효하지 않은 코드" 메시지 반환.
        // 코드 길이 패턴(예: SALE-XXXX)과 에러 메시지를 통해 공격자가 유효한 쿠폰 코드를 자동으로 열거 가능.
        // Rate Limiting이나 CAPTCHA 없이 무한 시도 허용.
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "쿠폰 코드 '" + code + "'를 찾을 수 없습니다."));

        if (!coupon.isActive()) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "이미 사용된 쿠폰입니다: " + code);
        }

        return CouponResponse.from(coupon);
    }
}
