package com.vul.shop.domain.order;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
	@EntityGraph(attributePaths = "items")
	List<OrderEntity> findByUserEmailOrderByOrderedAtDesc(String userEmail);
}
