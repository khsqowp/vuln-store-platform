package com.vul.shop.domain.commerce;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommerceRecordRepository extends JpaRepository<CommerceRecordEntity, Long> {
	List<CommerceRecordEntity> findByDomainTypeOrderByCreatedAtDesc(String domainType);
	List<CommerceRecordEntity> findByDomainTypeAndOwnerKeyOrderByCreatedAtDesc(String domainType, String ownerKey);
	Optional<CommerceRecordEntity> findByRecordKey(String recordKey);
	long countByDomainTypeAndRecordKeyStartingWith(String domainType, String recordKeyPrefix);
}
