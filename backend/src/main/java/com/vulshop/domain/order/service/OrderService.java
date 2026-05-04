package com.vulshop.domain.order.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.order.dto.OrderCreateRequest;
import com.vulshop.domain.order.dto.OrderResponse;
import com.vulshop.domain.order.entity.Order;
import com.vulshop.domain.order.entity.OrderItem;
import com.vulshop.domain.order.repository.CartItemRepository;
import com.vulshop.domain.order.repository.OrderItemRepository;
import com.vulshop.domain.order.repository.OrderRepository;
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
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse createOrder(Long userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 취약점 39 (가격 위변조):
        // 실제 상품 가격(product.getPrice())을 가져와서 합산하지 않고,
        // 클라이언트가 보낸 request.getTotalAmount() 나 item.getPrice()를 그대로 신뢰함.
        Order order = Order.builder()
                .user(user)
                .totalAmount(request.getTotalAmount()) // 무조건 신뢰
                .status("PAID") // 결제 완료로 간주
                .build();
        orderRepository.save(order);

        for (OrderCreateRequest.OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
            
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .orderPrice(itemDto.getPrice()) // 위변조된 개별 가격 신뢰
                    .build();
            orderItemRepository.save(orderItem);
        }

        // 장바구니 비우기
        cartItemRepository.deleteByUserId(userId);

        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderDetail(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 취약점 2 (IDOR - 불충분한 인가):
        // 해당 주문이 현재 로그인한 userId(토큰에서 가져온 값)의 주문인지 검증하지 않음.
        // if (!order.getUser().getId().equals(userId)) { throw new CustomException(...) }
        // 이 로직이 누락되어 누구나 orderId만 바꾸면 타인의 주문 내역 조회 가능.
        
        return OrderResponse.from(order);
    }

    @Transactional
    public void refundOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        
        // 권한 확인은 정상적으로 한다고 가정 (이거 안하면 IDOR 중복이 되니)
        if (!order.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        // 취약점 43 (재전송 공격 / 멱등성 부재):
        // 이미 취소된 주문인지 검증하는 로직이 없음.
        // if ("CANCELLED".equals(order.getStatus())) { throw new CustomException(...) } <- 누락됨
        
        order.updateStatus("CANCELLED");
        
        // 결제 금액만큼 사용자 마일리지 적립 (실제 PG사 취소 API 연동 대신 구현 편의상)
        User user = order.getUser();
        user.addMileage(order.getTotalAmount());
        
        // 상태를 변경하긴 하지만 트랜잭션 종료 시 저장됨. 그러나 검증 로직이 없으므로
        // 동일한 요청이 여러 번 오거나 레이스 컨디션 상황에서 무한히 마일리지가 적립될 수 있음.
    }
}
