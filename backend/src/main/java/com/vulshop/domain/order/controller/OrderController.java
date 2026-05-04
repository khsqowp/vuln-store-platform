package com.vulshop.domain.order.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.order.dto.OrderCreateRequest;
import com.vulshop.domain.order.dto.OrderResponse;
import com.vulshop.domain.order.service.OrderService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody OrderCreateRequest request) {
        // 취약점 39 (가격 조작)
        return ApiResponse.created(orderService.createOrder(userDetails.getUserId(), request));
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.ok(orderService.getMyOrders(userDetails.getUserId()));
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrderDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long orderId) {
        // 취약점 2 (IDOR)
        return ApiResponse.ok(orderService.getOrderDetail(userDetails.getUserId(), orderId));
    }

    @PostMapping("/{orderId}/refund")
    public ApiResponse<Void> refundOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long orderId) {
        // 취약점 43 (재전송 공격)
        orderService.refundOrder(userDetails.getUserId(), orderId);
        return ApiResponse.ok(null);
    }
}
