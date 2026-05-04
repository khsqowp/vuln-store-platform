package com.vulshop.domain.review.entity;

import com.vulshop.domain.product.entity.Product;
import com.vulshop.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private Integer rating; // 1~5

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 취약점 7: XSS 필터링 없이 저장되는 필드

    // 취약점 26: 업로드된 파일의 원본 경로를 그대로 저장 (확장자 우회 여부를 서버가 검증 안함)
    @Column(name = "image_url")
    private String imageUrl;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Review(Product product, User author, Integer rating, String content, String imageUrl) {
        this.product = product;
        this.author = author;
        this.rating = rating;
        this.content = content;
        this.imageUrl = imageUrl;
    }
}
