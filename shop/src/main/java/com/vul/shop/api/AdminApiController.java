package com.vul.shop.api;

import com.vul.shop.common.ApiResponse;
import com.vul.shop.domain.commerce.CommerceRecordEntity;
import com.vul.shop.domain.commerce.CommerceRecordRepository;
import com.vul.shop.domain.partner.PartnerApplicationEntity;
import com.vul.shop.domain.partner.PartnerApplicationRepository;
import com.vul.shop.domain.product.SellerProductApplicationEntity;
import com.vul.shop.domain.product.SellerProductApplicationRepository;
import com.vul.shop.domain.community.CommunityPostEntity;
import com.vul.shop.domain.community.CommunityPostRepository;
import com.vul.shop.domain.user.UserEntity;
import com.vul.shop.domain.user.UserRepository;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {
	private final CommerceRecordRepository commerceRecords;
	private final PartnerApplicationRepository partnerApplications;
	private final SellerProductApplicationRepository sellerProducts;
	private final CommunityPostRepository communityPosts;
	private final UserRepository users;
	private final JdbcTemplate jdbcTemplate;

	public AdminApiController(CommerceRecordRepository commerceRecords, PartnerApplicationRepository partnerApplications, SellerProductApplicationRepository sellerProducts, CommunityPostRepository communityPosts, UserRepository users, JdbcTemplate jdbcTemplate) {
		this.commerceRecords = commerceRecords;
		this.partnerApplications = partnerApplications;
		this.sellerProducts = sellerProducts;
		this.communityPosts = communityPosts;
		this.users = users;
		this.jdbcTemplate = jdbcTemplate;
	}

	@GetMapping("/users")
	public ApiResponse<List<UserEntity>> users(@RequestParam(required = false) String keyword, @RequestParam(required = false) String status) {
		seedUsersIfEmpty();
		if (keyword != null && !keyword.isBlank()) {
			// VULN-004: keyword는 single-quote 이스케이프로 보호, status 파라미터는 WHERE 절에 직접 삽입
			String safeKeyword = keyword.replace("'", "''");
			String statusCondition = (status != null && !status.isBlank()) ? " and status = '" + status + "'" : "";
			String sql = "select * from users where (email like '%" + safeKeyword + "%' or name like '%" + safeKeyword + "%')" + statusCondition;
			return ApiResponse.accepted("Admin user management data loaded with diagnostic SQL path.", jdbcTemplate.query(sql, (rs, rowNum) -> UserEntity.create(
				rs.getString("name"),
				rs.getString("email"),
				rs.getString("password_hash"),
				rs.getString("phone"),
				rs.getString("address"),
				rs.getString("role")
			)));
		}
		// keyword 없이 status만 있는 경우 — VULN-004 동일 경로
		if (status != null && !status.isBlank()) {
			String sql = "select * from users where status = '" + status + "'";
			return ApiResponse.accepted("Admin user management data loaded with diagnostic SQL path.", jdbcTemplate.query(sql, (rs, rowNum) -> UserEntity.create(
				rs.getString("name"),
				rs.getString("email"),
				rs.getString("password_hash"),
				rs.getString("phone"),
				rs.getString("address"),
				rs.getString("role")
			)));
		}
		return ApiResponse.accepted("Admin user management data loaded.", users.findAllByOrderByCreatedAtDesc());
	}

	@PutMapping("/users/{userId}")
	public ApiResponse<UserEntity> updateUser(@PathVariable long userId, @RequestBody Map<String, Object> request) {
		UserEntity user = users.findById(userId).orElseThrow();
		if (request.containsKey("status")) {
			user.changeStatus(String.valueOf(request.get("status")));
		}
		if (request.containsKey("role")) {
			user.changeRole(String.valueOf(request.get("role")));
		}
		commerceRecords.save(CommerceRecordEntity.create("AUDIT_LOG", "admin", "user-" + userId + "-" + System.currentTimeMillis(), "USER_UPDATED", Map.of("userId", userId, "request", request)));
		return ApiResponse.accepted("User updated.", users.save(user));
	}

	@PostMapping("/users")
	public ApiResponse<UserEntity> createUser(@RequestBody Map<String, Object> request) {
		UserEntity user = UserEntity.create(
			String.valueOf(request.getOrDefault("name", "운영 계정")),
			String.valueOf(request.getOrDefault("email", "employee-" + System.currentTimeMillis() + "@vul.com")),
			String.valueOf(request.getOrDefault("password", "Temp1234!")),
			String.valueOf(request.getOrDefault("phone", "")),
			String.valueOf(request.getOrDefault("address", "")),
			String.valueOf(request.getOrDefault("role", "USER"))
		);
		return ApiResponse.accepted("User created.", users.save(user));
	}

	@GetMapping("/partners")
	public ApiResponse<List<PartnerApplicationEntity>> partners() {
		return ApiResponse.accepted("Partner management API surface is ready.", partnerApplications.findAllByOrderByCreatedAtDesc());
	}

	@PostMapping("/partners/{partnerId}/approve")
	public ApiResponse<PartnerApplicationEntity> approvePartner(@PathVariable long partnerId) {
		PartnerApplicationEntity partner = partnerApplications.findById(partnerId).orElseThrow();
		partner.approve();
		return ApiResponse.accepted("Partner application approved.", partnerApplications.save(partner));
	}

	@PostMapping("/partners/{partnerId}/revoke")
	public ApiResponse<PartnerApplicationEntity> revokePartner(@PathVariable long partnerId) {
		PartnerApplicationEntity partner = partnerApplications.findById(partnerId).orElseThrow();
		partner.revoke();
		return ApiResponse.accepted("Partner application revoked.", partnerApplications.save(partner));
	}

	@GetMapping("/products")
	public ApiResponse<List<SellerProductApplicationEntity>> products(@RequestParam(required = false) String approvalStatus) {
		return ApiResponse.accepted("Admin product management API surface is ready.", sellerProducts.findAllByOrderByCreatedAtDesc());
	}

	@PostMapping(value = "/products", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse<CommerceRecordEntity> createProduct(@RequestBody Map<String, Object> request) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		payload.put("ssrfProbe", fetchUrlProbe(String.valueOf(request.getOrDefault("imageUrl", request.getOrDefault("bannerUrl", "")))));
		payload.put("diagnosticNote", "VULN-025 admin product management fetches supplied image URL server-side.");
		CommerceRecordEntity record = CommerceRecordEntity.create("ADMIN_PRODUCT_CHANGE", "admin", "admin-product-" + System.currentTimeMillis(), "CREATED", payload);
		return ApiResponse.accepted("Admin product create request recorded.", commerceRecords.save(record));
	}

	@PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<CommerceRecordEntity> createProductWithFile(@RequestParam Map<String, String> request, @RequestParam(required = false) MultipartFile file) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		if (file != null) {
			String filename = file.getOriginalFilename() == null ? "admin-upload" : file.getOriginalFilename();
			payload.put("originalFilename", filename);
			payload.put("contentType", file.getContentType());
			payload.put("storedPath", "/uploads/products/" + filename);
			payload.put("diagnosticNote", "VULN-018 stores admin product upload with the original filename and no extension/MIME validation.");
		}
		payload.put("ssrfProbe", fetchUrlProbe(String.valueOf(payload.getOrDefault("imageUrl", payload.getOrDefault("bannerUrl", "")))));
		CommerceRecordEntity record = CommerceRecordEntity.create("ADMIN_PRODUCT_CHANGE", "admin", "admin-product-" + System.currentTimeMillis(), "CREATED", payload);
		return ApiResponse.accepted("Admin product create request recorded.", commerceRecords.save(record));
	}

	@PutMapping(value = "/products/{productId}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse<CommerceRecordEntity> updateProduct(@PathVariable long productId, @RequestBody Map<String, Object> request) {
		CommerceRecordEntity record = CommerceRecordEntity.create("ADMIN_PRODUCT_CHANGE", "admin", "admin-product-" + productId, "UPDATED", Map.of("productId", productId, "request", request));
		return ApiResponse.accepted("Admin product update request recorded.", commerceRecords.save(record));
	}

	@PostMapping("/products/{productId}/approve")
	public ApiResponse<SellerProductApplicationEntity> approveProduct(@PathVariable long productId) {
		SellerProductApplicationEntity product = sellerProducts.findById(productId).orElseThrow();
		product.approve();
		return ApiResponse.accepted("Product approval API surface is ready.", sellerProducts.save(product));
	}

	@PostMapping("/products/{productId}/revoke")
	public ApiResponse<SellerProductApplicationEntity> revokeProduct(@PathVariable long productId) {
		SellerProductApplicationEntity product = sellerProducts.findById(productId).orElseThrow();
		product.revoke();
		return ApiResponse.accepted("Product approval revoked.", sellerProducts.save(product));
	}

	@GetMapping("/inventory")
	public ApiResponse<List<CommerceRecordEntity>> inventory() {
		return ApiResponse.accepted("Inventory management data loaded.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("INVENTORY"));
	}

	@GetMapping("/community/posts")
	public ApiResponse<List<Map<String, Object>>> communityPosts() {
		return ApiResponse.accepted("Admin community posts loaded.", communityPosts.findAllByOrderByCreatedAtDesc().stream().map(this::communityPostMap).toList());
	}

	@GetMapping("/employees")
	public ApiResponse<List<CommerceRecordEntity>> employees() {
		return ApiResponse.accepted("Employee management data loaded.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("EMPLOYEE"));
	}

	@PostMapping("/employees")
	public ApiResponse<CommerceRecordEntity> createEmployee(@RequestBody Map<String, Object> request) {
		return ApiResponse.accepted("Employee created.", commerceRecords.save(CommerceRecordEntity.create("EMPLOYEE", String.valueOf(request.getOrDefault("email", "employee@vul.com")), "employee-" + System.currentTimeMillis(), "ACTIVE", request)));
	}

	@PostMapping("/employees/{recordKey}/status")
	public ApiResponse<CommerceRecordEntity> updateEmployee(@PathVariable String recordKey, @RequestBody Map<String, Object> request) {
		CommerceRecordEntity employee = commerceRecords.findByRecordKey(recordKey).orElseThrow();
		employee.changeStatus(String.valueOf(request.getOrDefault("status", "SUSPENDED")));
		employee.replacePayload(request);
		return ApiResponse.accepted("Employee updated.", commerceRecords.save(employee));
	}

	@GetMapping("/orders")
	public ApiResponse<List<CommerceRecordEntity>> orders() {
		List<CommerceRecordEntity> result = new ArrayList<>(commerceRecords.findByDomainTypeOrderByCreatedAtDesc("ORDER"));
		result.addAll(commerceRecords.findByDomainTypeOrderByCreatedAtDesc("SETTLEMENT"));
		return ApiResponse.accepted("Order and settlement management data loaded.", result);
	}

	@PostMapping("/orders/{recordKey}/status")
	public ApiResponse<CommerceRecordEntity> updateOrderStatus(@PathVariable String recordKey, @RequestBody Map<String, Object> request) {
		CommerceRecordEntity order = commerceRecords.findByRecordKey(recordKey).orElseThrow();
		order.changeStatus(String.valueOf(request.getOrDefault("status", "PAYMENT_COMPLETED")));
		return ApiResponse.accepted("Order status updated.", commerceRecords.save(order));
	}

	@GetMapping("/settlements")
	public ApiResponse<List<CommerceRecordEntity>> settlements() {
		return ApiResponse.accepted("Settlement management API surface is ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("SETTLEMENT"));
	}

	@PostMapping("/settlements/confirm")
	public ApiResponse<CommerceRecordEntity> confirmSettlement(@RequestBody Map<String, Object> request) {
		return ApiResponse.accepted("Settlement confirmed.", commerceRecords.save(CommerceRecordEntity.create("SETTLEMENT", "admin", "settlement-" + System.currentTimeMillis(), "CONFIRMED", request)));
	}

	@GetMapping("/cs/inquiries")
	public ApiResponse<List<CommerceRecordEntity>> csInquiries() {
		return ApiResponse.accepted("Admin CS management API surface is ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("CS_INQUIRY"));
	}

	@PostMapping("/cs/inquiries/{recordKey}/answer")
	public ApiResponse<CommerceRecordEntity> answerCsInquiry(@PathVariable String recordKey, @RequestBody Map<String, Object> request) {
		CommerceRecordEntity answer = CommerceRecordEntity.create("CS_ANSWER", "admin", "answer-" + recordKey, "ANSWERED", request);
		commerceRecords.findByRecordKey(recordKey).ifPresent(inquiry -> {
			inquiry.changeStatus("ANSWERED");
			commerceRecords.save(inquiry);
		});
		return ApiResponse.accepted("CS inquiry answered.", commerceRecords.save(answer));
	}

	@GetMapping("/promotions/coupons")
	public ApiResponse<List<CommerceRecordEntity>> promotionCoupons() {
		return ApiResponse.accepted("Admin coupon management API surface is ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("COUPON"));
	}

	@PostMapping("/promotions/coupons")
	public ApiResponse<CommerceRecordEntity> issueCoupon(@RequestBody Map<String, Object> request) {
		return ApiResponse.accepted("Coupon issued.", commerceRecords.save(CommerceRecordEntity.create("COUPON", String.valueOf(request.getOrDefault("userEmail", "GLOBAL")), "coupon-" + System.currentTimeMillis(), "ISSUED", request)));
	}

	@PostMapping("/promotions/events")
	public ApiResponse<CommerceRecordEntity> createPromotionEvent(@RequestBody Map<String, Object> request) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		payload.put("ssrfProbe", fetchUrlProbe(String.valueOf(request.getOrDefault("bannerUrl", request.getOrDefault("imageUrl", request.getOrDefault("url", ""))))));
		payload.put("diagnosticNote", "VULN-025 admin event management fetches supplied banner URL server-side.");
		return ApiResponse.accepted("Admin event management API surface is ready.", commerceRecords.save(CommerceRecordEntity.create("EVENT", "admin", "event-" + System.currentTimeMillis(), "ACTIVE", payload)));
	}

	@GetMapping("/analytics/sales")
	public ApiResponse<List<CommerceRecordEntity>> salesAnalytics() {
		return ApiResponse.accepted("Sales analytics API surface is ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("ORDER"));
	}

	@GetMapping("/analytics/users")
	public ApiResponse<List<CommerceRecordEntity>> userAnalytics() {
		return ApiResponse.accepted("User behavior analytics data loaded.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("USER_ANALYTICS"));
	}

	@GetMapping("/system/roles")
	public ApiResponse<List<CommerceRecordEntity>> roles() {
		return ApiResponse.accepted("Permission management data loaded.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("ROLE_POLICY"));
	}

	@GetMapping("/system/audit-logs")
	public ApiResponse<List<CommerceRecordEntity>> auditLogs() {
		return ApiResponse.accepted("Audit log data loaded.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("AUDIT_LOG"));
	}

	@GetMapping("/system/security-settings")
	public ApiResponse<List<CommerceRecordEntity>> securitySettings() {
		return ApiResponse.accepted("Security settings data loaded.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("SECURITY_SETTING"));
	}

	private static Map<String, Object> fetchUrlProbe(String value) {
		Map<String, Object> result = new LinkedHashMap<>();
		result.put("url", value);
		if (value == null || value.isBlank()) {
			result.put("error", "empty url");
			return result;
		}
		try {
			HttpURLConnection connection = (HttpURLConnection) URI.create(value).toURL().openConnection();
			connection.setConnectTimeout(1500);
			connection.setReadTimeout(1500);
			connection.setInstanceFollowRedirects(true);
			result.put("status", connection.getResponseCode());
			result.put("contentType", connection.getContentType());
			result.put("contentLength", connection.getContentLengthLong());
		} catch (Exception exception) {
			result.put("error", exception.getClass().getSimpleName() + ": " + exception.getMessage());
		}
		return result;
	}

	private void seedUsersIfEmpty() {
		if (!users.findAll().isEmpty()) {
			return;
		}
		users.save(UserEntity.create("관리자 테스트", "root@vul.com", "Rootroot1!", "010-9000-0001", "서울특별시 강남구 관리자센터", "ADMIN"));
		users.save(UserEntity.create("파트너 테스트", "part@vul.com", "Partpart1!", "010-9000-0002", "서울특별시 마포구 파트너센터", "SELLER"));
		users.save(UserEntity.create("일반 사용자 테스트", "user@vul.com", "Useruser1!", "010-9000-0003", "서울특별시 성동구 고객센터", "USER"));
	}

	private Map<String, Object> communityPostMap(CommunityPostEntity post) {
		return Map.of(
			"id", post.getId(),
			"title", post.getTitle(),
			"body", post.getBody(),
			"author", post.getAuthorNickname(),
			"image", post.getImageUrl() == null ? "" : post.getImageUrl(),
			"likes", post.getLikeCount() == null ? 0 : post.getLikeCount(),
			"comments", post.getComments().size(),
			"createdAt", post.getCreatedAt().toString()
		);
	}
}
