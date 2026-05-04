package com.vulshop.domain.order.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.order.dto.CartItemRequest;
import com.vulshop.domain.order.dto.CartItemResponse;
import com.vulshop.domain.order.entity.CartItem;
import com.vulshop.domain.order.repository.CartItemRepository;
import com.vulshop.domain.product.entity.Product;
import com.vulshop.domain.product.repository.ProductRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addCartItem(Long userId, CartItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();
        
        cartItemRepository.save(cartItem);
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
                .map(CartItemResponse::from)
                .collect(Collectors.toList());
    }
}
