package com.vul.shop.domain.review;

import com.vul.shop.domain.product.ProductEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
	List<ReviewEntity> findByProductOrderByCreatedAtDesc(ProductEntity product);
}
