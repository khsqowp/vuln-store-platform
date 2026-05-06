package com.vul.shop.domain.partner;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerApplicationRepository extends JpaRepository<PartnerApplicationEntity, Long> {
	List<PartnerApplicationEntity> findAllByOrderByCreatedAtDesc();
	boolean existsByEmailAndStatus(String email, String status);
}
