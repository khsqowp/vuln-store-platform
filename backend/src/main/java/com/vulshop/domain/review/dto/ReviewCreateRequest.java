package com.vulshop.domain.review.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewCreateRequest {
    private Long productId;
    private Integer rating;
    // 취약점 7 (Stored XSS): HTML 태그를 그대로 받아 저장
    private String content;
    // 취약점 26: 클라이언트가 보낸 파일 URL을 검증 없이 저장 (multipart + 확장자 우회 시나리오는 컨트롤러에서 처리)
    private String imageUrl;
}
