package com.vul.shop.domain.community;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPostEntity, Long> {
	@EntityGraph(attributePaths = "comments")
	List<CommunityPostEntity> findAllByOrderByCreatedAtDesc();
}
