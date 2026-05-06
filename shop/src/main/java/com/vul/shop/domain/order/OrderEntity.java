package com.vul.shop.domain.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class OrderEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 60)
	private String orderNo;

	@Column(nullable = false, length = 160)
	private String userEmail;

	@Column(nullable = false, length = 80)
	private String receiverName;

	@Column(nullable = false, length = 255)
	private String address;

	@Column(nullable = false, length = 40)
	private String orderStatus;

	@Column(nullable = false, length = 40)
	private String deliveryStatus;

	@Column(length = 80)
	private String courier;

	@Column(length = 80)
	private String trackingNo;

	@Column(nullable = false)
	private Integer totalAmount;

	@Column(nullable = false)
	private LocalDateTime orderedAt;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItemEntity> items = new ArrayList<>();

	public static OrderEntity create(String orderNo, String userEmail, String receiverName, String address, String orderStatus,
		String deliveryStatus, String courier, String trackingNo, Integer totalAmount, LocalDateTime orderedAt) {
		OrderEntity order = new OrderEntity();
		order.orderNo = orderNo;
		order.userEmail = userEmail;
		order.receiverName = receiverName;
		order.address = address;
		order.orderStatus = orderStatus;
		order.deliveryStatus = deliveryStatus;
		order.courier = courier;
		order.trackingNo = trackingNo;
		order.totalAmount = totalAmount;
		order.orderedAt = orderedAt;
		return order;
	}

	public void addItem(String productCode, String productName, String productImage, String size, Integer quantity, Integer unitPrice) {
		this.items.add(OrderItemEntity.create(this, productCode, productName, productImage, size, quantity, unitPrice));
	}

	public String getOrderNo() {
		return orderNo;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public String getReceiverName() {
		return receiverName;
	}

	public String getAddress() {
		return address;
	}

	public String getOrderStatus() {
		return orderStatus;
	}

	public String getDeliveryStatus() {
		return deliveryStatus;
	}

	public String getCourier() {
		return courier;
	}

	public String getTrackingNo() {
		return trackingNo;
	}

	public Integer getTotalAmount() {
		return totalAmount;
	}

	public LocalDateTime getOrderedAt() {
		return orderedAt;
	}

	public List<OrderItemEntity> getItems() {
		return items;
	}
}
