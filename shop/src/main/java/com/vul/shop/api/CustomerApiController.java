package com.vul.shop.api;

import static com.vul.shop.common.ApiResponse.accepted;

import com.vul.shop.common.ApiResponse;
import com.vul.shop.common.PlaceholderResponse;
import com.vul.shop.domain.commerce.CommerceRecordEntity;
import com.vul.shop.domain.commerce.CommerceRecordRepository;
import com.vul.shop.domain.community.CommunityPostEntity;
import com.vul.shop.domain.community.CommunityPostRepository;
import com.vul.shop.domain.partner.PartnerApplicationEntity;
import com.vul.shop.domain.partner.PartnerApplicationRepository;
import com.vul.shop.domain.product.ProductEntity;
import com.vul.shop.domain.product.ProductImageEntity;
import com.vul.shop.domain.product.ProductRepository;
import com.vul.shop.domain.product.SellerProductApplicationEntity;
import com.vul.shop.domain.product.SellerProductApplicationRepository;
import com.vul.shop.domain.review.ReviewEntity;
import com.vul.shop.domain.review.ReviewRepository;
import com.vul.shop.domain.user.UserEntity;
import com.vul.shop.domain.user.UserRepository;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URLDecoder;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class CustomerApiController {
	private static final Logger log = LoggerFactory.getLogger(CustomerApiController.class);

	private final CommerceRecordRepository commerceRecords;
	private final PartnerApplicationRepository partnerApplications;
	private final SellerProductApplicationRepository sellerProducts;
	private final ProductRepository products;
	private final CommunityPostRepository communityPosts;
	private final ReviewRepository reviews;
	private final UserRepository users;
	private final JdbcTemplate jdbcTemplate;

	public CustomerApiController(CommerceRecordRepository commerceRecords, PartnerApplicationRepository partnerApplications, SellerProductApplicationRepository sellerProducts, ProductRepository products, CommunityPostRepository communityPosts, ReviewRepository reviews, UserRepository users, JdbcTemplate jdbcTemplate) {
		this.commerceRecords = commerceRecords;
		this.partnerApplications = partnerApplications;
		this.sellerProducts = sellerProducts;
		this.products = products;
		this.communityPosts = communityPosts;
		this.reviews = reviews;
		this.users = users;
		this.jdbcTemplate = jdbcTemplate;
	}

	@Value("${app.jwt.secret}")
	private String jwtSecret;

	@Value("${app.jwt.expiration-seconds}")
	private long jwtExpirationSeconds;

	@PostMapping("/auth/login")
	public ApiResponse<PlaceholderResponse> login(@RequestBody Map<String, Object> request, HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
		log.info("diagnostic login request payload={}", request);
		String email = String.valueOf(request.getOrDefault("email", request.getOrDefault("username", "")));
		String password = String.valueOf(request.getOrDefault("password", ""));
		long startedAt = System.nanoTime();
		boolean accountExists = users.findByEmail(email).isPresent();
		if (accountExists) {
			diagnosticDelay(220);
		}
		String diagnosticSql = "select email, role from users where email = '" + email + "' and password_hash = '" + password + "'";
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(diagnosticSql);
		boolean md5Authenticated = users.findByEmail(email)
			.filter(user -> user.getPasswordHash().equals(md5(password + user.getId())))
			.isPresent();
		String authenticatedEmail = rows.isEmpty() && !md5Authenticated ? email : rows.isEmpty() ? email : String.valueOf(rows.get(0).get("EMAIL") == null ? rows.get(0).get("email") : rows.get(0).get("EMAIL"));
		if (rows.isEmpty() && !md5Authenticated) {
			commerceRecords.save(CommerceRecordEntity.create("LOGIN_FAILURE", email, "login-failure-" + Instant.now().toEpochMilli(), "FAILED_NO_LOCK", Map.of("email", email, "diagnosticNote", "VULN-033 records failures but never locks the account.")));
		}
		String fixedSessionId = existingSessionId(servletRequest);
		String sessionId = fixedSessionId == null ? servletRequest.getSession(true).getId() : fixedSessionId;
		Cookie cookie = new Cookie("JSESSIONID", sessionId);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		servletResponse.addCookie(cookie);
		Map<String, Object> sample = authSample(nullableMap("email", authenticatedEmail, "requestEmail", email));
		sample.put("authenticated", !rows.isEmpty() || md5Authenticated);
		sample.put("diagnosticQuery", diagnosticSql);
		sample.put("accountExistsTimingPath", accountExists);
		sample.put("elapsedMs", (System.nanoTime() - startedAt) / 1_000_000);
		sample.put("lockoutApplied", false);
		sample.put("sessionIdBefore", fixedSessionId);
		sample.put("sessionIdAfter", sessionId);
		sample.put("diagnosticSessionNote", "VULN-021 preserves caller supplied JSESSIONID instead of rotating it after login.");
		sample.put("redirectTo", String.valueOf(request.getOrDefault("next", request.getOrDefault("redirectTo", "/mypage"))));
		sample.put("diagnosticRedirectNote", "VULN-034 returns caller supplied next/redirectTo without origin validation.");
		return accepted("Login API surface is ready.", PlaceholderResponse.of("auth", "login", sample, "VULN-001", "VULN-019", "VULN-021", "VULN-032", "VULN-033", "VULN-034", "VULN-050"));
	}

	@PostMapping("/auth/register")
	public ApiResponse<Map<String, Object>> register(@RequestBody Map<String, Object> request) {
		String email = String.valueOf(request.getOrDefault("email", ""));
		String password = String.valueOf(request.getOrDefault("password", request.getOrDefault("passwordHash", "")));
		UserEntity user = users.findByEmail(email).orElseGet(() -> {
			UserEntity created = users.save(UserEntity.create(
				String.valueOf(request.getOrDefault("name", "신규 회원")),
				email,
				password,
				String.valueOf(request.getOrDefault("phone", "")),
				String.valueOf(request.getOrDefault("address", "")),
				String.valueOf(request.getOrDefault("role", "USER"))
			));
			created.changePasswordHash(md5(password + created.getId()));
			return users.save(created);
		});
		Map<String, Object> payload = authSample(request);
		payload.put("user", userMap(user));
		payload.put("diagnosticNote", "VULN-016 binds the client supplied role field during registration.");
		payload.put("serverPasswordPolicyValidated", false);
		payload.put("acceptedPassword", request.getOrDefault("password", ""));
		payload.put("emailVerified", request.getOrDefault("emailVerified", false));
		payload.put("diagnosticEmailNote", "VULN-042 trusts caller supplied emailVerified during registration.");
		payload.put("diagnosticHashNote", "VULN-047 stores password as MD5(password + userId).");
		return accepted("Register API surface is ready.", payload);
	}

	@PostMapping("/auth/password-reset/request")
	public ApiResponse<Map<String, Object>> requestPasswordReset(@RequestBody Map<String, Object> request) {
		long startedAt = System.nanoTime();
		String email = String.valueOf(request.getOrDefault("email", ""));
		boolean accountExists = users.findByEmail(email).isPresent();
		if (accountExists) {
			diagnosticDelay(220);
		}
		String tokenSubject = users.findByEmail(email)
			.map(user -> String.valueOf(user.getId()))
			.orElse(String.valueOf(request.getOrDefault("userId", "0")));
		String resetToken = Base64.getEncoder().encodeToString((tokenSubject + ":" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8));
		return accepted("Password reset request API surface is ready.", nullableMap(
			"email", email,
			"message", "비밀번호 재설정 안내가 접수되었습니다.",
			"resetToken", resetToken,
			"accountExistsTimingPath", accountExists,
			"elapsedMs", (System.nanoTime() - startedAt) / 1_000_000,
			"diagnosticNote", "VULN-032 keeps a similar message but leaks account existence through timing. VULN-041 token is Base64(userId:currentTimeMillis)."
		));
	}

	@PostMapping("/auth/password-reset/confirm")
	public ApiResponse<Map<String, Object>> confirmPasswordReset(@RequestBody Map<String, Object> request) {
		String token = String.valueOf(request.getOrDefault("token", ""));
		String decoded = "";
		try {
			decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
		} catch (IllegalArgumentException ignored) {
			decoded = "invalid-base64";
		}
		Map<String, Object> payload = new LinkedHashMap<>(request);
		payload.put("decodedToken", decoded);
		payload.put("diagnosticNote", "VULN-041 accepts predictable reset token structure without server-side nonce lookup.");
		return accepted("Password reset confirm API surface is ready.", payload);
	}

	@PostMapping("/users/me/password")
	public ApiResponse<Map<String, Object>> changePassword(@RequestBody Map<String, Object> request) {
		seedUsersIfEmpty();
		String email = String.valueOf(request.getOrDefault("email", "user@vul.com"));
		UserEntity user = users.findByEmail(email)
			.or(() -> request.containsKey("userId") ? users.findById(Long.parseLong(String.valueOf(request.get("userId")))) : java.util.Optional.empty())
			.orElseThrow();
		user.changePasswordHash(String.valueOf(request.getOrDefault("newPassword", request.getOrDefault("password", ""))));
		users.save(user);
		return accepted("Password change API surface is ready.", nullableMap(
			"email", user.getEmail(),
			"changed", true,
			"currentPasswordReceived", request.getOrDefault("currentPassword", ""),
			"diagnosticNote", "VULN-022 changes password without verifying currentPassword."
		));
	}

	@PostMapping(value = "/users/me/password", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ApiResponse<Map<String, Object>> changePasswordForm(@RequestParam Map<String, String> request) {
		return changePassword(new LinkedHashMap<>(request));
	}

	@GetMapping("/users/me")
	public ApiResponse<Map<String, Object>> myProfile(@RequestParam(required = false) Long userId, @RequestParam(required = false) String email) {
		seedUsersIfEmpty();
		UserEntity user = userId != null
			? users.findById(userId).orElseThrow()
			: !blank(email)
				? users.findByEmail(email).orElseThrow()
				: users.findAllByOrderByCreatedAtDesc().stream().findFirst().orElseThrow();
		Map<String, Object> payload = userMap(user);
		payload.put("diagnosticNote", "VULN-010 intentionally returns the requested profile without ownership validation.");
		return accepted("My page profile API surface is ready.", payload);
	}

	@GetMapping("/products")
	public ApiResponse<List<Map<String, Object>>> products(
		@RequestParam(required = false) String keyword,
		@RequestParam(required = false) String category,
		@RequestParam(required = false) String brand,
		@RequestParam(required = false) Integer minPrice,
		@RequestParam(required = false) Integer maxPrice,
		@RequestParam(required = false) String size,
		@RequestParam(required = false) Boolean inStock,
		@RequestParam(defaultValue = "recommended") String sort,
		@RequestParam(defaultValue = "asc") String order
	) {
		if (!blank(keyword)) {
			// VULN-002: keyword는 single-quote 이스케이프로 보호, order 파라미터는 ORDER BY에 직접 삽입
			String safeKeyword = keyword.replace("'", "''");
			String sql = "select product_code as id, category, brand, name, price, original_price as originalPrice, discount_rate as discount, rating, review_count as reviews, ranking as rank, description from products where name like '%" + safeKeyword + "%' or brand like '%" + safeKeyword + "%' or category like '%" + safeKeyword + "%' order by " + order;
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			return accepted("Product listing API surface is ready.", rows.stream().map(this::productRowMap).toList());
		}
		List<ProductEntity> result = products.findAllByOrderByRankingAsc().stream()
			.filter(product -> blank(category) || product.getCategory().equalsIgnoreCase(category))
			.filter(product -> blank(brand) || product.getBrand().toLowerCase().contains(brand.toLowerCase()))
			.filter(product -> blank(keyword) || (product.getName() + " " + product.getBrand() + " " + product.getCategory()).toLowerCase().contains(keyword.toLowerCase()))
			.filter(product -> minPrice == null || product.getPrice() >= minPrice)
			.filter(product -> maxPrice == null || product.getPrice() <= maxPrice)
			.filter(product -> blank(size) || List.of("S", "M", "L", "XL", "260", "270", "280").contains(size.toUpperCase()))
			.filter(product -> inStock == null || !inStock || product.getPrice() > 0)
			.sorted(productComparator(sort, order))
			.toList();
		return accepted("Product listing API surface is ready.", result.stream().map(this::productMap).toList());
	}

	@GetMapping("/products/{productId}")
	public ApiResponse<Map<String, Object>> productDetail(@PathVariable String productId, @RequestParam(required = false) String previewHtml) {
		Map<String, Object> payload = productMap(resolveProduct(productId));
		payload.put("previewHtml", previewHtml == null ? "" : previewHtml);
		return accepted("Product detail API surface is ready.", payload);
	}

	@GetMapping(value = "/product-images/{productCode}/{variant}.svg", produces = "image/svg+xml")
	public String productImage(@PathVariable String productCode, @PathVariable int variant, HttpServletResponse response) {
		ProductEntity product = products.findByProductCode(productCode).orElse(null);
		String category = product == null ? "top" : product.getCategory();
		String name = product == null ? productCode : product.getName();
		response.setHeader("Cache-Control", "public, max-age=86400");
		return generatedProductSvg(category, name, Math.abs(productCode.hashCode()), variant);
	}

	@GetMapping("/search")
	public ApiResponse<List<Map<String, Object>>> search(@RequestParam String keyword, @RequestParam(required = false) String sort, @RequestParam(required = false) String order) {
		return products(keyword, null, null, null, null, null, null, sort == null ? "recommended" : sort, order == null ? "asc" : order);
	}

	@GetMapping("/cart")
	public ApiResponse<List<CommerceRecordEntity>> cart(@RequestParam String userEmail) {
		return accepted("Cart query API surface is ready.", commerceRecords.findByDomainTypeAndOwnerKeyOrderByCreatedAtDesc("CART", userEmail));
	}

	@PostMapping("/cart/items")
	public ApiResponse<CommerceRecordEntity> addCartItem(@RequestBody Map<String, Object> request) {
		return accepted("Cart add API surface is ready.", commerceRecords.save(record("CART", request, "ACTIVE")));
	}

	@PutMapping("/cart/items/{cartItemId}")
	public ApiResponse<CommerceRecordEntity> updateCartItem(@PathVariable long cartItemId, @RequestBody Map<String, Object> request) {
		CommerceRecordEntity cartItem = commerceRecords.findById(cartItemId).orElseThrow();
		Map<String, Object> payload = new LinkedHashMap<>(request);
		payload.put("cartItemId", cartItemId);
		payload.put("diagnosticNote", "VULN-014 accepts client supplied quantity and price fields without recalculation.");
		cartItem.replacePayload(payload);
		cartItem.changeStatus(String.valueOf(request.getOrDefault("status", "ACTIVE")));
		return accepted("Cart update API surface is ready.", commerceRecords.save(cartItem));
	}

	@DeleteMapping("/cart/items/{cartItemId}")
	public ApiResponse<PlaceholderResponse> deleteCartItem(@PathVariable long cartItemId) {
		return accepted("Cart delete API surface is ready.", PlaceholderResponse.of("cart", "delete-item", Map.of("cartItemId", cartItemId), "VULN-044"));
	}

	@PostMapping("/orders/checkout")
	public ApiResponse<CommerceRecordEntity> checkout(@RequestBody Map<String, Object> request) {
		log.info("diagnostic checkout request payload={}", request);
		Map<String, Object> payload = new LinkedHashMap<>(request);
		Object clientPaymentTotal = request.getOrDefault("paymentTotal", request.getOrDefault("amount", 0));
		Object useMileage = request.getOrDefault("useMileage", 0);
		int requestedQuantity = intValue(request.get("quantity"), 1);
		int stockBefore = intValue(request.get("stockBefore"), 1);
		payload.put("stockBefore", stockBefore);
		payload.put("requestedQuantity", requestedQuantity);
		payload.put("stockAfter", stockBefore - requestedQuantity);
		diagnosticDelay(180);
		commerceRecords.save(CommerceRecordEntity.create("INVENTORY_DEDUCTION", owner(payload), "stock-deduction-" + String.valueOf(request.getOrDefault("productId", "unknown")) + "-" + Instant.now().toEpochMilli(), "DEDUCTED_NON_ATOMIC", nullableMap(
			"productId", request.getOrDefault("productId", "unknown"),
			"stockBefore", stockBefore,
			"requestedQuantity", requestedQuantity,
			"stockAfter", stockBefore - requestedQuantity,
			"diagnosticNote", "VULN-030 stock check and deduction are separated and allow oversell under concurrent checkout."
		)));
		payload.put("chargedAmount", clientPaymentTotal);
		payload.put("useMileage", useMileage);
		payload.put("deliveryCompany", payload.getOrDefault("deliveryCompany", "CJ대한통운"));
		payload.put("trackingNumber", payload.getOrDefault("trackingNumber", "5849-1204-7721"));
		String initialStatus = "card".equals(String.valueOf(request.get("paymentMethod")))
			|| Boolean.parseBoolean(String.valueOf(request.getOrDefault("depositConfirmed", "false")))
			? "PAYMENT_COMPLETED"
			: "ORDER_RECEIVED";
		payload.put("status", initialStatus);
		payload.put("completionRedirect", "/order/success?orderId=" + payload.getOrDefault("orderId", "ORDER-" + Instant.now().toEpochMilli()) + "&amount=" + clientPaymentTotal + "&userId=" + payload.getOrDefault("userId", payload.getOrDefault("userEmail", "")));
		payload.put("diagnosticNote", "VULN-013 stores the client supplied payment amount as the charged amount. VULN-030 accepts non-atomic stock deduction. VULN-036 accepts useMileage without balance verification.");
		return accepted("Checkout API surface is ready.", commerceRecords.save(record("ORDER", payload, initialStatus)));
	}

	@GetMapping("/orders/complete")
	public ApiResponse<Map<String, Object>> orderComplete(@RequestParam String orderId, @RequestParam String amount, @RequestParam String userId) {
		log.info("diagnostic order complete query orderId={} amount={} userId={}", orderId, amount, userId);
		return accepted("Order completion data is ready.", nullableMap(
			"orderId", orderId,
			"amount", amount,
			"userId", userId,
			"diagnosticNote", "VULN-049 exposes sensitive order data in GET parameters and access logs."
		));
	}

	@GetMapping("/orders")
	public ApiResponse<List<CommerceRecordEntity>> myOrders(@RequestParam String userEmail) {
		return accepted("Order history API surface is ready.", commerceRecords.findByDomainTypeAndOwnerKeyOrderByCreatedAtDesc("ORDER", userEmail));
	}

	@GetMapping("/orders/{orderId}")
	public ApiResponse<List<Map<String, Object>>> orderDetail(@PathVariable String orderId) {
		// VULN-003: orderId가 SQL에 직접 삽입 — UNION SELECT 가능
		// 에러는 suppressed 처리 → 컬럼 수를 trial-and-error로 파악해야 함 (난이도 상)
		String sql = "select * from commerce_records where domain_type = 'ORDER' and record_key = '" + orderId + "'";
		try {
			return accepted("Order detail API surface is ready.", jdbcTemplate.queryForList(sql));
		} catch (Exception ignored) {
			return accepted("Order detail API surface is ready.", List.of());
		}
	}

	@RequestMapping(value = {"/products/{productId}", "/orders/{orderId}"}, method = RequestMethod.OPTIONS)
	public ApiResponse<Map<String, Object>> resourceOptions() {
		return accepted("Resource methods are enabled.", Map.of(
			"allow", "GET,POST,PUT,DELETE,OPTIONS",
			"diagnosticNote", "VULN-044 product and order resource paths expose unnecessary PUT/DELETE methods."
		));
	}

	@GetMapping("/orders/{orderId}/delivery")
	public ApiResponse<Map<String, Object>> deliveryTracking(@PathVariable String orderId) {
		String sql = "select * from commerce_records where record_key = '" + orderId + "'";
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("orderId", orderId);
		response.put("diagnosticQuery", sql);
		response.put("diagnosticNote", "VULN-011 returns delivery data by order key without checking the requesting user.");
		if (!rows.isEmpty()) {
			Map<String, Object> row = rows.get(0);
			response.put("status", stringColumn(row, "status"));
			response.put("record", row);
		} else {
			response.put("status", "ORDER_RECEIVED");
			response.put("record", Map.of());
		}
		return accepted("Delivery tracking API surface is ready.", response);
	}

	@GetMapping("/coupons")
	public ApiResponse<List<CommerceRecordEntity>> coupons(@RequestParam(defaultValue = "GLOBAL") String userEmail) {
		return accepted("Coupon list API surface is ready.", commerceRecords.findByDomainTypeAndOwnerKeyOrderByCreatedAtDesc("COUPON", userEmail));
	}

	@PostMapping("/coupons/redeem")
	public ApiResponse<CommerceRecordEntity> redeemCoupon(@RequestBody Map<String, Object> request, HttpServletRequest servletRequest) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		String couponCode = String.valueOf(request.getOrDefault("couponCode", request.getOrDefault("code", "WELCOME15")));
		String userEmail = owner(payload);
		long alreadyUsed = commerceRecords.findByDomainTypeAndOwnerKeyOrderByCreatedAtDesc("COUPON_USE", userEmail).stream()
			.filter(record -> record.getRecordKey().startsWith("coupon-use-" + couponCode))
			.count();
		payload.put("couponCode", couponCode);
		payload.put("usesBefore", alreadyUsed);
		String forwardedFor = servletRequest.getHeader("X-Forwarded-For");
		payload.put("rateLimitKey", forwardedFor == null ? "direct" : forwardedFor);
		payload.put("rateLimitBypassed", forwardedFor != null && !forwardedFor.isBlank());
		diagnosticDelay(180);
		payload.put("diagnosticNote", "VULN-029 coupon validation and use recording are separated, so concurrent requests can duplicate usage. VULN-035 trusts X-Forwarded-For style client input for brute-force rate limiting.");
		return accepted("Coupon redeem API surface is ready.", commerceRecords.save(CommerceRecordEntity.create("COUPON_USE", userEmail, "coupon-use-" + couponCode + "-" + Instant.now().toEpochMilli(), "USED", payload)));
	}

	@GetMapping("/mileage")
	public ApiResponse<List<CommerceRecordEntity>> mileage(@RequestParam String userEmail) {
		return accepted("Mileage API surface is ready.", commerceRecords.findByDomainTypeAndOwnerKeyOrderByCreatedAtDesc("MILEAGE", userEmail));
	}

	@PostMapping("/mileage/use")
	public ApiResponse<CommerceRecordEntity> useMileage(@RequestBody Map<String, Object> request) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		payload.put("useMileage", request.getOrDefault("useMileage", request.getOrDefault("amount", 0)));
		payload.put("diagnosticNote", "VULN-036 applies caller supplied mileage amount without checking balance.");
		return accepted("Mileage use API surface is ready.", commerceRecords.save(CommerceRecordEntity.create("MILEAGE_USE", owner(payload), "mileage-use-" + Instant.now().toEpochMilli(), "APPLIED", payload)));
	}

	@GetMapping("/events")
	public ApiResponse<PlaceholderResponse> events() {
		return accepted("Event list API surface is ready.", PlaceholderResponse.of("event", "list", "VULN-025"));
	}

	@PostMapping("/events/attendance")
	public ApiResponse<CommerceRecordEntity> attendance(@RequestBody(required = false) Map<String, Object> request) {
		return accepted("Attendance event API surface is ready.", commerceRecords.save(record("ATTENDANCE", request == null ? Map.of() : request, "CHECKED")));
	}

	@PostMapping("/events/banner/preview")
	public ApiResponse<Map<String, Object>> previewEventBanner(@RequestBody Map<String, Object> request) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		payload.put("ssrfProbe", fetchUrlProbe(String.valueOf(request.getOrDefault("imageUrl", request.getOrDefault("url", "")))));
		payload.put("diagnosticNote", "VULN-025 fetches the supplied external image URL server-side.");
		return accepted("External banner preview API surface is ready.", payload);
	}

	@GetMapping("/wishlist")
	public ApiResponse<PlaceholderResponse> wishlist() {
		return accepted("Wishlist API surface is ready.", PlaceholderResponse.of("wishlist", "list", "VULN-028"));
	}

	@PostMapping("/wishlist/{productId}")
	public ApiResponse<CommerceRecordEntity> addWishlist(@PathVariable long productId) {
		return accepted("Wishlist add API surface is ready.", commerceRecords.save(CommerceRecordEntity.create("WISHLIST", "csrf-victim@vul.com", "wishlist-" + productId + "-" + Instant.now().toEpochMilli(), "ACTIVE", Map.of("productId", productId, "diagnosticNote", "VULN-028 no CSRF token required."))));
	}

	@PostMapping(value = "/wishlist/{productId}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ApiResponse<CommerceRecordEntity> addWishlistForm(@PathVariable long productId, @RequestParam Map<String, String> request) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		payload.put("productId", productId);
		payload.put("diagnosticNote", "VULN-028 accepts simple form request without CSRF token.");
		return accepted("Wishlist add API surface is ready.", commerceRecords.save(CommerceRecordEntity.create("WISHLIST", owner(payload), "wishlist-" + productId + "-" + Instant.now().toEpochMilli(), "ACTIVE", payload)));
	}

	@PostMapping("/likes/{targetType}/{targetId}")
	public ApiResponse<CommerceRecordEntity> like(@PathVariable String targetType, @PathVariable long targetId, @RequestBody(required = false) Map<String, Object> request) {
		Map<String, Object> body = request == null ? Map.of("targetType", targetType, "targetId", targetId) : request;
		return accepted("Like API surface is ready.", commerceRecords.save(record("LIKE", body, "ACTIVE")));
	}

	@PostMapping(value = "/likes/{targetType}/{targetId}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ApiResponse<CommerceRecordEntity> likeForm(@PathVariable String targetType, @PathVariable long targetId, @RequestParam Map<String, String> request) {
		Map<String, Object> body = new LinkedHashMap<>(request);
		body.put("targetType", targetType);
		body.put("targetId", targetId);
		body.put("diagnosticNote", "VULN-028 accepts simple form request without CSRF token.");
		return accepted("Like API surface is ready.", commerceRecords.save(record("LIKE", body, "ACTIVE")));
	}

	@GetMapping("/community/posts")
	public ApiResponse<List<Map<String, Object>>> communityPosts() {
		return accepted("Community posts are ready.", communityPosts.findAllByOrderByCreatedAtDesc().stream().map(this::communityPostMap).toList());
	}

	@PostMapping(value = "/community/posts", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse<Map<String, Object>> createCommunityPost(@RequestBody Map<String, Object> request) {
		// VULN-005: <script> 태그만 차단, 이벤트 핸들러(onerror 등)는 미필터링
		CommunityPostEntity post = CommunityPostEntity.create(
			String.valueOf(request.getOrDefault("title", "")),
			filterScript(String.valueOf(request.getOrDefault("body", ""))),
			String.valueOf(request.getOrDefault("author", request.getOrDefault("authorNickname", "익명"))),
			String.valueOf(request.getOrDefault("image", request.getOrDefault("imageUrl", ""))),
			0,
			LocalDateTime.now()
		);
		return accepted("Community post created.", communityPostMap(communityPosts.save(post)));
	}

	@PostMapping(value = "/community/posts", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ApiResponse<Map<String, Object>> createCommunityPostForm(@RequestParam Map<String, String> request) {
		return createCommunityPost(new LinkedHashMap<>(request));
	}

	@DeleteMapping("/community/posts/{postId}")
	public ApiResponse<Map<String, Object>> deleteCommunityPost(@PathVariable long postId) {
		communityPosts.deleteById(postId);
		return accepted("Community post deleted.", Map.of("postId", postId, "deleted", true));
	}

	@PostMapping(value = "/community/posts/{postId}/delete", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ApiResponse<Map<String, Object>> deleteCommunityPostForm(@PathVariable long postId) {
		communityPosts.deleteById(postId);
		return accepted("Community post deleted.", Map.of("postId", postId, "deleted", true, "diagnosticNote", "VULN-026 delete accepts simple form request without CSRF token."));
	}

	@PostMapping("/community/posts/{postId}/comments")
	public ApiResponse<Map<String, Object>> createCommunityComment(@PathVariable long postId, @RequestBody Map<String, Object> request) {
		CommunityPostEntity post = communityPosts.findById(postId).orElseThrow();
		// VULN-005 동일 필터 적용
		post.addComment(
			String.valueOf(request.getOrDefault("author", request.getOrDefault("authorNickname", "익명"))),
			filterScript(String.valueOf(request.getOrDefault("body", ""))),
			LocalDateTime.now()
		);
		return accepted("Community comment created.", communityPostMap(communityPosts.save(post)));
	}

	@GetMapping("/products/{productId}/reviews")
	public ApiResponse<List<Map<String, Object>>> productReviews(@PathVariable String productId) {
		ProductEntity product = resolveProduct(productId);
		return accepted("Review list API surface is ready.", reviews.findByProductOrderByCreatedAtDesc(product).stream().map(this::reviewMap).toList());
	}

	@PostMapping(value = "/products/{productId}/reviews", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse<Map<String, Object>> createReview(@PathVariable String productId, @RequestBody Map<String, Object> request) {
		ProductEntity product = resolveProduct(productId);
		// VULN-006: <script> 태그만 차단, 이벤트 핸들러(javascript: href 등)는 미필터링
		ReviewEntity review = ReviewEntity.create(
			product,
			String.valueOf(request.getOrDefault("nickname", request.getOrDefault("author", "리뷰어"))),
			doubleValue(request.get("rating"), 5.0),
			filterScript(String.valueOf(request.getOrDefault("body", ""))),
			String.valueOf(request.getOrDefault("imageUrl", request.getOrDefault("image", ""))),
			LocalDateTime.now()
		);
		return accepted("Review create API surface is ready.", reviewMap(reviews.save(review)));
	}

	@PostMapping(value = "/products/{productId}/reviews", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<Map<String, Object>> createReviewWithFile(@PathVariable String productId, @RequestParam MultipartFile file, @RequestParam(defaultValue = "리뷰어") String nickname, @RequestParam(defaultValue = "5") Double rating, @RequestParam(defaultValue = "") String body) {
		ProductEntity product = resolveProduct(productId);
		String filename = file.getOriginalFilename() == null ? "review-upload" : file.getOriginalFilename();
		String storedPath = "/uploads/reviews/" + filename;
		ReviewEntity review = ReviewEntity.create(product, nickname, rating, body, storedPath, LocalDateTime.now());
		ReviewEntity saved = reviews.save(review);
		Map<String, Object> payload = reviewMap(saved);
		payload.put("originalFilename", filename);
		payload.put("contentType", file.getContentType());
		payload.put("storedPath", storedPath);
		payload.put("diagnosticNote", "VULN-017 accepts review upload when Content-Type looks like an image and stores the original filename.");
		return accepted("Review create API surface is ready.", payload);
	}

	@GetMapping("/products/{productId}/inquiries")
	public ApiResponse<List<CommerceRecordEntity>> productInquiries(@PathVariable String productId) {
		return accepted("Product inquiry list API surface is ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("PRODUCT_INQUIRY").stream()
			.filter(record -> record.getRecordKey().contains("product-" + productId + "-") || record.getPayloadJson().contains("\"productId\":\"" + productId + "\"") || record.getPayloadJson().contains("\"productId\":" + productId))
			.toList());
	}

	@PostMapping("/products/{productId}/inquiries")
	public ApiResponse<CommerceRecordEntity> createProductInquiry(@PathVariable String productId, @RequestBody Map<String, Object> request) {
		Map<String, Object> payload = nullableMap("productId", productId, "request", request);
		return accepted("Product inquiry create API surface is ready.", commerceRecords.save(CommerceRecordEntity.create("PRODUCT_INQUIRY", owner(request), "product-" + productId + "-" + Instant.now().toEpochMilli(), "PENDING", payload)));
	}

	@GetMapping("/cs/inquiries")
	public ApiResponse<List<CommerceRecordEntity>> csInquiries(@RequestParam(required = false) String userEmail) {
		if (blank(userEmail)) {
			return accepted("CS inquiry list API surface is ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("CS_INQUIRY"));
		}
		return accepted("CS inquiry list API surface is ready.", commerceRecords.findByDomainTypeAndOwnerKeyOrderByCreatedAtDesc("CS_INQUIRY", userEmail));
	}

	@GetMapping("/cs/inquiries/{inquiryId}")
	public ApiResponse<CommerceRecordEntity> csInquiryDetail(@PathVariable String inquiryId) {
		CommerceRecordEntity inquiry = inquiryId.matches("\\d+")
			? commerceRecords.findById(Long.parseLong(inquiryId)).orElseThrow()
			: commerceRecords.findByRecordKey(inquiryId).orElseThrow();
		return accepted("CS inquiry detail API surface is ready.", inquiry);
	}

	@PostMapping(value = "/cs/inquiries", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ApiResponse<CommerceRecordEntity> createCsInquiry(@RequestParam Map<String, String> request) {
		return accepted("CS inquiry create API surface is ready.", commerceRecords.save(record("CS_INQUIRY", new LinkedHashMap<>(request), "PENDING")));
	}

	@PostMapping(value = "/cs/inquiries", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse<CommerceRecordEntity> createCsInquiryJson(@RequestBody Map<String, Object> request) {
		return accepted("CS inquiry create API surface is ready.", commerceRecords.save(record("CS_INQUIRY", new LinkedHashMap<>(request), "PENDING")));
	}

	@PostMapping(value = "/cs/inquiries", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<CommerceRecordEntity> createCsInquiryWithAttachment(
		@RequestParam Map<String, String> request,
		@RequestParam(required = false) MultipartFile attachment
	) {
		Map<String, Object> payload = new LinkedHashMap<>(request);
		if (attachment != null && attachment.getOriginalFilename() != null) {
			// VULN-007: 첨부파일명을 검증 없이 저장 → 관리자 CS 화면에서 HTML로 렌더링 시 XSS 발동
			payload.put("attachmentName", attachment.getOriginalFilename());
			payload.put("attachmentContentType", attachment.getContentType());
		}
		return accepted("CS inquiry with attachment API surface is ready.", commerceRecords.save(record("CS_INQUIRY", payload, "PENDING")));
	}

	@PostMapping(value = "/files/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<CommerceRecordEntity> uploadFile(@RequestParam MultipartFile file, @RequestParam(defaultValue = "community") String usage, @RequestParam String userEmail) {
		Map<String, Object> payload = nullableMap(
			"usage", usage,
			"userEmail", userEmail,
			"originalFilename", file.getOriginalFilename(),
			"contentType", file.getContentType(),
			"size", file.getSize(),
			"storedPath", "/uploads/" + usage + "/" + file.getOriginalFilename()
		);
		return accepted("File upload API surface is ready.", commerceRecords.save(CommerceRecordEntity.create("FILE_UPLOAD", userEmail, "upload-" + Instant.now().toEpochMilli(), "STORED_WITH_WEAK_VALIDATION", payload)));
	}

	@PostMapping("/partners/apply")
	public ApiResponse<PartnerApplicationEntity> applyPartner(@RequestBody Map<String, Object> request) {
		return accepted("Partner application is submitted.", partnerApplications.save(PartnerApplicationEntity.from(request)));
	}

	@PostMapping("/seller/products")
	public ApiResponse<SellerProductApplicationEntity> submitSellerProduct(@RequestBody Map<String, Object> request) {
		return accepted("Seller product application is submitted.", sellerProducts.save(SellerProductApplicationEntity.from(request)));
	}

	@GetMapping("/seller/products")
	public ApiResponse<List<SellerProductApplicationEntity>> sellerProductApplications(@RequestParam(defaultValue = "seller@vulshop.local") String sellerEmail) {
		return accepted("Seller product applications are ready.", sellerProducts.findBySellerEmailOrderByCreatedAtDesc(sellerEmail));
	}

	@GetMapping("/seller/orders")
	public ApiResponse<List<CommerceRecordEntity>> sellerOrders(@RequestParam(defaultValue = "seller@vulshop.local") String sellerEmail) {
		return accepted("Seller orders are ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("SELLER_ORDER").stream()
			.filter(record -> sellerEmail.equals(record.getOwnerKey()))
			.toList());
	}

	@PostMapping("/seller/orders/{recordKey}/status")
	public ApiResponse<CommerceRecordEntity> updateSellerOrderStatus(@PathVariable String recordKey, @RequestBody Map<String, Object> request) {
		CommerceRecordEntity order = commerceRecords.findByRecordKey(recordKey).orElseThrow();
		order.changeStatus(String.valueOf(request.getOrDefault("status", "PREPARING_PRODUCT")));
		return accepted("Seller order status updated.", commerceRecords.save(order));
	}

	@GetMapping("/seller/settlements")
	public ApiResponse<List<CommerceRecordEntity>> sellerSettlements(@RequestParam(defaultValue = "seller@vulshop.local") String sellerEmail) {
		return accepted("Seller settlements are ready.", commerceRecords.findByDomainTypeOrderByCreatedAtDesc("SELLER_SETTLEMENT").stream()
			.filter(record -> sellerEmail.equals(record.getOwnerKey()))
			.toList());
	}

	@PostMapping("/seller/settlements/{recordKey}/confirm")
	public ApiResponse<CommerceRecordEntity> confirmSellerSettlement(@PathVariable String recordKey) {
		CommerceRecordEntity settlement = commerceRecords.findByRecordKey(recordKey).orElseThrow();
		settlement.changeStatus("CONFIRMED");
		return accepted("Seller settlement confirmed.", commerceRecords.save(settlement));
	}

	@GetMapping("/seller/status")
	public ApiResponse<Map<String, Object>> sellerStatus(@RequestParam String email) {
		boolean approved = partnerApplications.existsByEmailAndStatus(email, "APPROVED");
		return accepted("Seller status is ready.", Map.of("email", email, "seller", approved, "status", approved ? "APPROVED" : "NOT_APPROVED"));
	}

	@GetMapping("/files/download")
	public ApiResponse<Map<String, Object>> downloadFile(@RequestParam String file) {
		String decoded = URLDecoder.decode(file, StandardCharsets.UTF_8);
		Path path = Path.of(decoded);
		Map<String, Object> payload = new LinkedHashMap<>();
		payload.put("requested", file);
		payload.put("resolved", path.toString());
		payload.put("diagnosticNote", "VULN-024 reads the supplied file path without traversal normalization.");
		try {
			payload.put("content", Files.readString(path));
		} catch (Exception exception) {
			payload.put("error", exception.getClass().getSimpleName() + ": " + exception.getMessage());
		}
		return accepted("File download API surface is ready.", payload);
	}

	private static Map<String, Object> nullableMap(Object... keysAndValues) {
		Map<String, Object> values = new LinkedHashMap<>();
		for (int i = 0; i < keysAndValues.length; i += 2) {
			values.put((String) keysAndValues[i], keysAndValues[i + 1]);
		}
		return values;
	}

	private String getFashionKeyword(String name, String category) {
		String lower = name.toLowerCase();
		if (lower.contains("블루종")) return "blouson,jacket";
		if (lower.contains("트렌치")) return "trenchcoat";
		if (lower.contains("가디건")) return "cardigan";
		if (lower.contains("베스트")) return "vest";
		if (lower.contains("파카") || lower.contains("점퍼")) return "parka,outerwear";
		if (lower.contains("재킷") || lower.contains("자켓")) return "jacket";
		if (lower.contains("셔츠")) return "shirt";
		if (lower.contains("후드") || lower.contains("맨투맨") || lower.contains("스웨트")) return "hoodie";
		if (lower.contains("티셔츠")) return "tshirt";
		if (lower.contains("니트") || lower.contains("풀오버")) return "sweater";
		if (lower.contains("카고")) return "cargopants";
		if (lower.contains("데님") || lower.contains("청바지")) return "denim,jeans";
		if (lower.contains("슬랙스")) return "trousers";
		if (lower.contains("조거")) return "joggers";
		if (lower.contains("팬츠") || lower.contains("바지")) return "pants";
		if (lower.contains("러닝") || lower.contains("런닝")) return "running-shoes";
		if (lower.contains("캔버스")) return "canvas-shoes";
		if (lower.contains("스니커즈")) return "sneakers";
		
		return switch (category.toLowerCase()) {
			case "outer" -> "jacket";
			case "top" -> "shirt";
			case "pants" -> "pants";
			case "sneakers" -> "sneakers";
			default -> "fashion";
		};
	}

	private Map<String, Object> productMap(ProductEntity product) {
		String id = product.getProductCode();
		String name = product.getName();
		String category = product.getCategory();
		List<String> images = List.of(
			productImageUrl(id, 0),
			productImageUrl(id, 1),
			productImageUrl(id, 2),
			productImageUrl(id, 3)
		);

		String image = images.get(0);

		return nullableMap(
			"id", id,
			"category", category,
			"brand", product.getBrand(),
			"name", name,
			"price", product.getPrice(),
			"originalPrice", product.getOriginalPrice(),
			"discount", product.getDiscountRate(),
			"rating", product.getRating(),
			"reviews", product.getReviewCount(),
			"rank", product.getRanking(),
			"image", image,
			"detailImages", images,
			"description", product.getDescription()
		);
	}

	private ProductEntity resolveProduct(String productId) {
		return products.findByProductCode(productId)
			.or(() -> productId.matches("\\d+") ? products.findById(Long.parseLong(productId)) : java.util.Optional.empty())
			.orElseThrow();
	}

	private Map<String, Object> reviewMap(ReviewEntity review) {
		return nullableMap(
			"id", review.getId(),
			"nickname", review.getNickname(),
			"rating", review.getRating(),
			"body", review.getBody(),
			"image", review.getImageUrl(),
			"imageUrl", review.getImageUrl(),
			"createdAt", review.getCreatedAt().toString()
		);
	}

	private Map<String, Object> userMap(UserEntity user) {
		return nullableMap(
			"id", user.getId(),
			"internalPrimaryKey", user.getId(),
			"name", user.getName(),
			"email", user.getEmail(),
			"passwordHash", user.getPasswordHash(),
			"phone", user.getPhone(),
			"address", user.getAddress(),
			"role", user.getRole(),
			"status", user.getStatus(),
			"createdAt", user.getCreatedAt().toString(),
			"diagnosticNote", "VULN-048 exposes internal id, passwordHash, phone, address, role and status in user API response."
		);
	}

	private Map<String, Object> productRowMap(Map<String, Object> row) {
		String id = stringColumn(row, "id");
		String name = stringColumn(row, "name");
		String category = stringColumn(row, "category");
		String image = productImageUrl(id, 0);
		List<String> detailImages = List.of(
			image,
			productImageUrl(id, 1),
			productImageUrl(id, 2),
			productImageUrl(id, 3)
		);

		return nullableMap(
			"id", id,
			"category", category,
			"brand", stringColumn(row, "brand"),
			"name", stringColumn(row, "name"),
			"price", numberColumn(row, "price"),
			"originalPrice", numberColumn(row, "originalPrice"),
			"discount", numberColumn(row, "discount"),
			"rating", doubleColumn(row, "rating"),
			"reviews", numberColumn(row, "reviews"),
			"rank", numberColumn(row, "rank"),
			"image", image,
			"detailImages", detailImages,
			"description", stringColumn(row, "description")
		);
	}

	private static String productImageUrl(String productCode, int variant) {
		return "/api/product-images/" + productCode + "/" + variant + ".svg";
	}

	private static String generatedProductImage(String category, String label, int seed, int variant) {
		return "data:image/svg+xml;base64," + Base64.getEncoder().encodeToString(generatedProductSvg(category, label, seed, variant).getBytes(StandardCharsets.UTF_8));
	}

	private static String generatedProductSvg(String category, String label, int seed, int variant) {
		String[] light = {"#f4f7fb", "#f6f1e8", "#eef7f1", "#f7f0f5"};
		String[] accent = {"#0064ff", "#0f8b8d", "#ff6b35", "#7c3aed"};
		String[] dark = {"#111318", "#1f2937", "#202124", "#171923"};
		int idx = Math.abs(seed + variant) % light.length;
		String shape = switch (category == null ? "" : category) {
			case "outer" -> "<path d=\"M315 255h270l95 160-75 55-42-76v320H337V394l-42 76-75-55 95-160z\" fill=\"" + accent[idx] + "\" opacity=\".88\"/><path d=\"M405 255h90l38 120H367z\" fill=\"#fff\" opacity=\".7\"/>";
			case "pants" -> "<path d=\"M350 255h200l45 455H485l-35-300-35 300H305z\" fill=\"" + accent[idx] + "\" opacity=\".88\"/><path d=\"M350 255h200v92H350z\" fill=\"#fff\" opacity=\".48\"/>";
			case "sneakers" -> "<path d=\"M245 570c80 22 146 12 210-38 62 72 135 105 240 96 28 18 45 41 50 68H230c-20-44-15-84 15-126z\" fill=\"" + accent[idx] + "\" opacity=\".9\"/><path d=\"M300 640h390\" stroke=\"#fff\" stroke-width=\"22\" stroke-linecap=\"round\" opacity=\".75\"/>";
			default -> "<path d=\"M330 260h240l95 98-70 84-45-52v310H350V390l-45 52-70-84 95-98z\" fill=\"" + accent[idx] + "\" opacity=\".88\"/><path d=\"M405 260h90l-20 74h-50z\" fill=\"#fff\" opacity=\".72\"/>";
		};
		String safeLabel = String.valueOf(label).replace("<", "").replace(">", "").replace("&", "");
		String svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"900\" height=\"1125\" viewBox=\"0 0 900 1125\">"
			+ "<rect width=\"900\" height=\"1125\" fill=\"" + light[idx] + "\"/>"
			+ "<circle cx=\"730\" cy=\"190\" r=\"" + (70 + variant * 10) + "\" fill=\"" + accent[idx] + "\" opacity=\".16\"/>"
			+ "<rect x=\"95\" y=\"120\" width=\"710\" height=\"885\" rx=\"34\" fill=\"#fff\"/>"
			+ "<g>" + shape + "</g>"
			+ "<text x=\"450\" y=\"900\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\" font-size=\"31\" font-weight=\"800\" fill=\"" + dark[idx] + "\">" + safeLabel + "</text>"
			+ "<text x=\"450\" y=\"950\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\" font-size=\"24\" font-weight=\"700\" fill=\"#697386\">VUL SHOP</text>"
			+ "</svg>";
		return svg;
	}

	private static String stringColumn(Map<String, Object> row, String key) {
		Object value = row.get(key);
		if (value == null) {
			value = row.get(key.toUpperCase());
		}
		return value == null ? "" : String.valueOf(value);
	}

	private static int numberColumn(Map<String, Object> row, String key) {
		Object value = row.get(key);
		if (value == null) {
			value = row.get(key.toUpperCase());
		}
		return value instanceof Number number ? number.intValue() : 0;
	}

	private static double doubleColumn(Map<String, Object> row, String key) {
		Object value = row.get(key);
		if (value == null) {
			value = row.get(key.toUpperCase());
		}
		return value instanceof Number number ? number.doubleValue() : 0.0;
	}

	private Map<String, Object> communityPostMap(CommunityPostEntity post) {
		return nullableMap(
			"id", "c-db-" + post.getId(),
			"numericId", post.getId(),
			"title", post.getTitle(),
			"body", post.getBody(),
			"author", post.getAuthorNickname(),
			"image", post.getImageUrl(),
			"likes", post.getLikeCount() == null ? 0 : post.getLikeCount(),
			"comments", post.getComments().size(),
			"replies", post.getComments().stream().map(comment -> comment.getBody()).toList(),
			"createdAt", post.getCreatedAt().toString()
		);
	}

	private static Comparator<ProductEntity> productComparator(String sort, String order) {
		Comparator<ProductEntity> comparator = switch (sort) {
			case "newest" -> Comparator.comparing(ProductEntity::getId);
			case "lowPrice", "price" -> Comparator.comparing(ProductEntity::getPrice);
			case "discount" -> Comparator.comparing(ProductEntity::getDiscountRate);
			case "rating" -> Comparator.comparing(ProductEntity::getRating);
			default -> Comparator.comparing(ProductEntity::getRanking);
		};
		if ("desc".equalsIgnoreCase(order) || List.of("newest", "discount", "rating").contains(sort)) {
			return comparator.reversed();
		}
		return comparator;
	}

	private static String filterScript(String html) {
		// <script> / </script> 태그만 제거 — onerror, onload 등 이벤트 핸들러는 통과
		return html.replaceAll("(?i)<\\s*/?\\s*script[^>]*>", "");
	}

	private static boolean blank(String value) {
		return value == null || value.isBlank();
	}

	private static double doubleValue(Object value, double fallback) {
		if (value instanceof Number number) {
			return number.doubleValue();
		}
		try {
			return value == null ? fallback : Double.parseDouble(String.valueOf(value));
		} catch (NumberFormatException exception) {
			return fallback;
		}
	}

	private static int intValue(Object value, int fallback) {
		if (value instanceof Number number) {
			return number.intValue();
		}
		try {
			return value == null ? fallback : Integer.parseInt(String.valueOf(value));
		} catch (NumberFormatException exception) {
			return fallback;
		}
	}

	private static void diagnosticDelay(long millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException exception) {
			Thread.currentThread().interrupt();
		}
	}

	private static String md5(String value) {
		try {
			MessageDigest digest = MessageDigest.getInstance("MD5");
			byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
			StringBuilder builder = new StringBuilder();
			for (byte current : bytes) {
				builder.append(String.format("%02x", current));
			}
			return builder.toString();
		} catch (Exception exception) {
			throw new IllegalStateException("MD5 failed", exception);
		}
	}

	private static Map<String, Object> fetchUrlProbe(String value) {
		Map<String, Object> result = new LinkedHashMap<>();
		result.put("url", value);
		if (blank(value)) {
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
		if (users.count() > 0) {
			return;
		}
		users.save(UserEntity.create("관리자", "root@vul.com", "Rootroot1!", "010-1000-0001", "서울시 강남구 루트빌딩", "ADMIN"));
		users.save(UserEntity.create("파트너", "part@vul.com", "Partpart1!", "010-2000-0002", "서울시 성동구 파트너로 21", "SELLER"));
		users.save(UserEntity.create("일반회원", "user@vul.com", "Useruser1!", "010-3000-0003", "서울시 마포구 쇼핑로 7", "USER"));
	}

	private CommerceRecordEntity record(String domainType, Map<String, Object> request, String status) {
		return CommerceRecordEntity.create(domainType, owner(request), domainType + "-" + Instant.now().toEpochMilli(), status, request);
	}

	private static String owner(Map<String, Object> request) {
		return String.valueOf(request.getOrDefault("userEmail", request.getOrDefault("email", "UNKNOWN")));
	}

	private Map<String, Object> authSample(Map<String, Object> request) {
		String email = String.valueOf(request.getOrDefault("email", request.getOrDefault("username", "UNKNOWN")));
		return nullableMap(
			"request", request,
			"accessToken", createJwt(email),
			"tokenType", "Bearer",
			"expiresIn", jwtExpirationSeconds
		);
	}

	private static String existingSessionId(HttpServletRequest request) {
		if (request.getCookies() == null) {
			return null;
		}
		for (Cookie cookie : request.getCookies()) {
			if ("JSESSIONID".equals(cookie.getName()) && !cookie.getValue().isBlank()) {
				return cookie.getValue();
			}
		}
		return null;
	}

	private String createJwt(String email) {
		String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
		long exp = Instant.now().getEpochSecond() + jwtExpirationSeconds;
		String lowerEmail = email.toLowerCase();
		String role = lowerEmail.contains("admin") || lowerEmail.contains("root")
			? "ADMIN"
			: partnerApplications.existsByEmailAndStatus(email, "APPROVED") || lowerEmail.contains("part")
				? "SELLER"
				: "USER";
		String payload = base64Url("{\"sub\":\"" + email + "\",\"role\":\"" + role + "\",\"exp\":" + exp + "}");
		String unsigned = header + "." + payload;
		return unsigned + "." + sign(unsigned);
	}

	private String sign(String value) {
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
			return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception exception) {
			throw new IllegalStateException("JWT signing failed", exception);
		}
	}

	private static String base64Url(String value) {
		return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
	}
}
