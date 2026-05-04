package com.vulshop.domain.coupon.dto;

import com.vulshop.domain.coupon.entity.Coupon;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CouponResponse {
    private Long id;
    private String code;
    private String name;
    private Integer discountAmount;
    private Integer minOrderAmount;

    public static CouponResponse from(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .discountAmount(coupon.getDiscountAmount())
                .minOrderAmount(coupon.getMinOrderAmount())
                .build();
    }
}
