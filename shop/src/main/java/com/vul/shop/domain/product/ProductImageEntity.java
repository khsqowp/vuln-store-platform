package com.vul.shop.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImageEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private ProductEntity product;

	@Column(nullable = false, length = 1000)
	private String imageUrl;

	@Column(nullable = false, length = 30)
	private String imageType;

	@Column(nullable = false)
	private Integer sortOrder;

	public static ProductImageEntity create(ProductEntity product, String imageUrl, String imageType, Integer sortOrder) {
		ProductImageEntity image = new ProductImageEntity();
		image.product = product;
		image.imageUrl = imageUrl;
		image.imageType = imageType;
		image.sortOrder = sortOrder;
		return image;
	}

	public Long getId() {
		return id;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public String getImageType() {
		return imageType;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}
}
