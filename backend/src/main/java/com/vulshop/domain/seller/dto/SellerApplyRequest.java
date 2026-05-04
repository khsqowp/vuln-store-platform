package com.vulshop.domain.seller.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerApplyRequest {
    private String brandName;
    private String businessNumber; // 취약점 33: 사업자번호 형식 검증 없음
    private String description;
}
