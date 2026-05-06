package com.vul.shop.api;

import com.vul.shop.common.ApiResponse;
import com.vul.shop.domain.commerce.CommerceRecordEntity;
import com.vul.shop.domain.commerce.CommerceRecordRepository;
import com.vul.shop.domain.user.UserEntity;
import com.vul.shop.domain.user.UserRepository;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/api")
public class LegacyAdminBypassController {
	private final UserRepository users;
	private final CommerceRecordRepository commerceRecords;

	public LegacyAdminBypassController(UserRepository users, CommerceRecordRepository commerceRecords) {
		this.users = users;
		this.commerceRecords = commerceRecords;
	}

	@GetMapping("/users")
	public ApiResponse<List<UserEntity>> users() {
		seedUsersIfEmpty();
		return ApiResponse.accepted("Legacy admin users API loaded without admin filter.", users.findAllByOrderByCreatedAtDesc());
	}

	@GetMapping("/stats")
	public ApiResponse<Map<String, Object>> stats() {
		return ApiResponse.accepted("Legacy admin stats API loaded without admin filter.", Map.of(
			"users", users.count(),
			"orders", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("ORDER").size(),
			"diagnosticNote", "VULN-023 legacy /admin/api/** route is outside the protected /api/admin/** filter."
		));
	}

	private void seedUsersIfEmpty() {
		if (!users.findAll().isEmpty()) {
			return;
		}
		users.save(UserEntity.create("관리자 테스트", "root@vul.com", "Rootroot1!", "010-9000-0001", "서울특별시 강남구 관리자센터", "ADMIN"));
		users.save(UserEntity.create("파트너 테스트", "part@vul.com", "Partpart1!", "010-9000-0002", "서울특별시 마포구 파트너센터", "SELLER"));
		users.save(UserEntity.create("일반 사용자 테스트", "user@vul.com", "Useruser1!", "010-9000-0003", "서울특별시 성동구 고객센터", "USER"));
	}
}
