package com.vul.shop.domain.product;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class ProductEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 60)
	private String productCode;

	@Column(nullable = false, length = 40)
	private String category;

	@Column(nullable = false, length = 80)
	private String brand;

	@Column(nullable = false, length = 160)
	private String name;

	@Column(nullable = false)
	private Integer price;

	private Integer originalPrice;
	private Integer discountRate;
	private Double rating;
	private Integer reviewCount;
	private Integer ranking;

	@Column(length = 1000)
	private String description;

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	private List<ProductImageEntity> images = new ArrayList<>();

	public static ProductEntity create(String productCode, String category, String brand, String name, Integer price,
		Integer originalPrice, Integer discountRate, Double rating, Integer reviewCount, Integer ranking, String description) {
		ProductEntity product = new ProductEntity();
		product.productCode = productCode;
		product.category = category;
		product.brand = brand;
		product.name = name;
		product.price = price;
		product.originalPrice = originalPrice;
		product.discountRate = discountRate;
		product.rating = rating;
		product.reviewCount = reviewCount;
		product.ranking = ranking;
		product.description = description;
		return product;
	}

	public void addImage(String imageUrl, String imageType, Integer sortOrder) {
		ProductImageEntity image = ProductImageEntity.create(this, imageUrl, imageType, sortOrder);
		this.images.add(image);
	}

	public Long getId() {
		return id;
	}

	public String getProductCode() {
		return productCode;
	}

	public String getCategory() {
		return category;
	}

	public String getBrand() {
		return brand;
	}

	public String getName() {
		return name;
	}

	public Integer getPrice() {
		return price;
	}

	public Integer getOriginalPrice() {
		return originalPrice;
	}

	public Integer getDiscountRate() {
		return discountRate;
	}

	public Double getRating() {
		return rating;
	}

	public Integer getReviewCount() {
		return reviewCount;
	}

	public Integer getRanking() {
		return ranking;
	}

	public String getDescription() {
		return description;
	}

	public List<ProductImageEntity> getImages() {
		return images;
	}
}
