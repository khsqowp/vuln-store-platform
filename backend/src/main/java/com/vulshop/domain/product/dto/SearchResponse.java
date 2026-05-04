package com.vulshop.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class SearchResponse {
    private String searchKeyword; // 취약점 1: 이스케이프 되지 않은 검색어 반환용 필드
    private List<ProductResponse> results;
}
