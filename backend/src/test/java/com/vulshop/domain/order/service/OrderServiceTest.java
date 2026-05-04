package com.vulshop.domain.order.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.domain.order.dto.OrderCreateRequest;
import com.vulshop.domain.order.dto.OrderResponse;
import com.vulshop.domain.order.entity.Order;
import com.vulshop.domain.order.repository.CartItemRepository;
import com.vulshop.domain.order.repository.OrderItemRepository;
import com.vulshop.domain.order.repository.OrderRepository;
import com.vulshop.domain.product.entity.Product;
import com.vulshop.domain.product.repository.ProductRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;

    @Test
    @DisplayName("가격 조작 취약점(39): 클라이언트가 보낸 1원 가격이 그대로 결제됨")
    void createOrder_PriceManipulation() {
        // given
        Long userId = 1L;
        User user = User.builder().email("test@test.com").build();
        
        Product realProduct = Product.builder().price(500000).build(); // 실제 50만원짜리 상품

        OrderCreateRequest request = new OrderCreateRequest();
        request.setTotalAmount(1); // 조작된 총 금액 1원
        
        OrderCreateRequest.OrderItemDto itemDto = new OrderCreateRequest.OrderItemDto();
        itemDto.setProductId(100L);
        itemDto.setQuantity(1);
        itemDto.setPrice(1); // 조작된 개별 금액 1원
        request.setItems(List.of(itemDto));

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(productRepository.findById(100L)).willReturn(Optional.of(realProduct));

        // when
        OrderResponse response = orderService.createOrder(userId, request);

        // then
        assertEquals(1, response.getTotalAmount()); // 50만원 상품이지만 1원으로 주문 성공
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    @DisplayName("IDOR 취약점(2): 타인의 주문 상세 조회 시 권한 검증 누락")
    void getOrderDetail_IDOR() {
        // given
        Long attackerId = 999L;
        Long orderId = 1L;
        User victim = User.builder().email("victim@test.com").build();
        // 리플렉션을 안쓰므로 mock으로 처리
        Order victimOrder = Order.builder().user(victim).totalAmount(10000).status("PAID").build();

        given(orderRepository.findById(orderId)).willReturn(Optional.of(victimOrder));

        // when
        OrderResponse response = orderService.getOrderDetail(attackerId, orderId);

        // then
        // 예외가 발생하지 않고 조회가 성공하면 취약점이 존재하는 것임
        assertNotNull(response);
        assertEquals(10000, response.getTotalAmount());
    }


    @Test
    @DisplayName("재전송 공격 취약점(43): 이미 환불된 주문을 반복 환불하여 마일리지 무한 적립")
    void refundOrder_ReplayAttack() {
        // given
        Long userId = 1L;
        User user = User.builder().email("test@test.com").build();
        ReflectionTestUtils.setField(user, "id", userId);
        Order order = Order.builder().user(user).totalAmount(50000).status("PAID").build();

        given(orderRepository.findById(1L)).willReturn(Optional.of(order));

        // when: 첫 번째 환불 요청
        orderService.refundOrder(userId, 1L);
        // when: 두 번째 환불 요청 (취소 상태 검증 로직이 없어서 또 진행됨)
        orderService.refundOrder(userId, 1L);

        // then
        // 50000원이 두 번 환불(적립)되어 100000원이 되어야 함
        assertEquals(100000, user.getMileage());
    }
}
