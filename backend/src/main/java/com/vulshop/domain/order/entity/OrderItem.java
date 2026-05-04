package com.vulshop.domain.order.entity;

import com.vulshop.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "order_price", nullable = false)
    private Integer orderPrice;

    @Builder
    public OrderItem(Order order, Product product, Integer quantity, Integer orderPrice) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.orderPrice = orderPrice;
    }
}
