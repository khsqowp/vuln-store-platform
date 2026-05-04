package com.vulshop.domain.order.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.order.dto.CartItemRequest;
import com.vulshop.domain.order.dto.CartItemResponse;
import com.vulshop.domain.order.service.CartService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<List<CartItemResponse>> getCartItems(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.ok(cartService.getCartItems(userDetails.getUserId()));
    }

    @PostMapping
    public ApiResponse<Void> addCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CartItemRequest request) {
        cartService.addCartItem(userDetails.getUserId(), request);
        return ApiResponse.ok(null);
    }
}
