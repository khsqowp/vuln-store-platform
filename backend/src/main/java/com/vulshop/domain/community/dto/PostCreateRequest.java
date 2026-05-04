package com.vulshop.domain.community.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateRequest {
    private String title;
    
    // 취약점 4: Stored XSS (HTML 태그를 그대로 받아들임)
    private String content;
}
