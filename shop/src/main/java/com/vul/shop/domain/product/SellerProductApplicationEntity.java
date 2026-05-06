package com.vul.shop.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "seller_product_applications")
public class SellerProductApplicationEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 160)
	private String sellerEmail;

	@Column(nullable = false, length = 40)
	private String category;

	@Column(nullable = false, length = 80)
	private String brand;

	@Column(nullable = false, length = 160)
	private String name;

	@Column(nullable = false)
	private Integer price;

	@Column(length = 1000)
	private String imageUrl;

	@Column(length = 1000)
	private String description;

	@Column(nullable = false, length = 30)
	private String approvalStatus = "PENDING";

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public static SellerProductApplicationEntity from(Map<String, Object> request) {
		SellerProductApplicationEntity product = new SellerProductApplicationEntity();
		product.sellerEmail = String.valueOf(request.getOrDefault("sellerEmail", ""));
		product.category = String.valueOf(request.getOrDefault("category", ""));
		product.brand = String.valueOf(request.getOrDefault("brand", ""));
		product.name = String.valueOf(request.getOrDefault("name", ""));
		product.price = Integer.parseInt(String.valueOf(request.getOrDefault("price", "0")));
		product.imageUrl = String.valueOf(request.getOrDefault("imageUrl", ""));
		product.description = String.valueOf(request.getOrDefault("description", ""));
		return product;
	}

	public void approve() {
		this.approvalStatus = "APPROVED";
	}

	public void reject() {
		this.approvalStatus = "REJECTED";
	}

	public void revoke() {
		this.approvalStatus = "REVOKED";
	}

	public Long getId() {
		return id;
	}

	public String getSellerEmail() {
		return sellerEmail;
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

	public String getImageUrl() {
		return imageUrl;
	}

	public String getDescription() {
		return description;
	}

	public String getApprovalStatus() {
		return approvalStatus;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
