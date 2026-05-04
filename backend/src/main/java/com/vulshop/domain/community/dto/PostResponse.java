package com.vulshop.domain.community.dto;

import com.vulshop.domain.community.entity.Post;
import com.vulshop.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content; // 취약점 4 (Stored XSS): 렌더링 시 필터링 없이 노출될 필드
    private LocalDateTime createdAt;
    
    // 취약점 46: 응답 내 민감정보 과도 노출
    // 작성자 정보를 응답할 때, DTO로 안전하게 변환하지 않고 User 엔티티 객체를 직렬화하거나
    // 패스워드 해시값, 전화번호 등 불필요한 민감 정보까지 모두 노출함.
    private User authorDetails;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .authorDetails(post.getAuthor()) // 통째로 넘김
                .build();
    }
}
