package com.vul.shop.domain.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerProductApplicationRepository extends JpaRepository<SellerProductApplicationEntity, Long> {
	List<SellerProductApplicationEntity> findAllByOrderByCreatedAtDesc();
	List<SellerProductApplicationEntity> findBySellerEmailOrderByCreatedAtDesc(String sellerEmail);
}
