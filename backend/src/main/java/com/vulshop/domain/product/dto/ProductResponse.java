package com.vulshop.domain.product.dto;

import com.vulshop.domain.product.entity.Product;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private Integer price;
    private Integer stockQuantity;
    private String imageUrl;
    private String description;
    private String category;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .description(product.getDescription())
                .category(product.getCategory())
                .build();
    }
}
