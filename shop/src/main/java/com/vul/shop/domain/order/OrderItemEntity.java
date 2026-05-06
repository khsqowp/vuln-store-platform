package com.vul.shop.domain.order;

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
@Table(name = "order_items")
public class OrderItemEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id", nullable = false)
	private OrderEntity order;

	@Column(nullable = false, length = 60)
	private String productCode;

	@Column(nullable = false, length = 160)
	private String productName;

	@Column(length = 1000)
	private String productImage;

	@Column(nullable = false, length = 20)
	private String size;

	@Column(nullable = false)
	private Integer quantity;

	@Column(nullable = false)
	private Integer unitPrice;

	public static OrderItemEntity create(OrderEntity order, String productCode, String productName, String productImage, String size, Integer quantity, Integer unitPrice) {
		OrderItemEntity item = new OrderItemEntity();
		item.order = order;
		item.productCode = productCode;
		item.productName = productName;
		item.productImage = productImage;
		item.size = size;
		item.quantity = quantity;
		item.unitPrice = unitPrice;
		return item;
	}

	public String getProductCode() {
		return productCode;
	}

	public String getProductName() {
		return productName;
	}

	public String getProductImage() {
		return productImage;
	}

	public String getSize() {
		return size;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public Integer getUnitPrice() {
		return unitPrice;
	}
}
