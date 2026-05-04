package com.vulshop.domain.order.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderCreateRequest {
    // 취약점 39: 서버가 자체적으로 장바구니나 DB에서 가격을 조회하지 않고, 클라이언트가 넘긴 가격을 그대로 신뢰
    private List<OrderItemDto> items;
    private Integer totalAmount;

    @Getter
    @Setter
    public static class OrderItemDto {
        private Long productId;
        private Integer quantity;
        private Integer price; // 위변조 대상: 이 가격으로 결제됨
    }
}
