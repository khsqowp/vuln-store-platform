package com.vulshop.domain.seller.repository;

import com.vulshop.domain.seller.entity.SellerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, Long> {
    Optional<SellerApplication> findByUserId(Long userId);
}
