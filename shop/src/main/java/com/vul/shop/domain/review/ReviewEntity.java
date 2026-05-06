package com.vul.shop.domain.review;

import com.vul.shop.domain.product.ProductEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class ReviewEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private ProductEntity product;

	@Column(nullable = false, length = 100)
	private String nickname;

	@Column(nullable = false)
	private Double rating;

	@Column(nullable = false, length = 1200)
	private String body;

	@Column(length = 1000)
	private String imageUrl;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	public static ReviewEntity create(ProductEntity product, String nickname, Double rating, String body, String imageUrl, LocalDateTime createdAt) {
		ReviewEntity review = new ReviewEntity();
		review.product = product;
		review.nickname = nickname;
		review.rating = rating;
		review.body = body;
		review.imageUrl = imageUrl;
		review.createdAt = createdAt;
		return review;
	}

	public Long getId() {
		return id;
	}

	public String getNickname() {
		return nickname;
	}

	public Double getRating() {
		return rating;
	}

	public String getBody() {
		return body;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
