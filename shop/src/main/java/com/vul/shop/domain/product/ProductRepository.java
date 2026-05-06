package com.vul.shop.domain.product;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
	@EntityGraph(attributePaths = "images")
	List<ProductEntity> findAllByOrderByRankingAsc();

	@EntityGraph(attributePaths = "images")
	List<ProductEntity> findByCategory(String category);

	@EntityGraph(attributePaths = "images")
	Optional<ProductEntity> findByProductCode(String productCode);
}
