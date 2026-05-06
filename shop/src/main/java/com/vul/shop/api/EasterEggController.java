package com.vul.shop.api;

import com.vul.shop.common.ApiResponse;
import com.vul.shop.domain.commerce.CommerceRecordEntity;
import com.vul.shop.domain.commerce.CommerceRecordRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/easter-egg")
public class EasterEggController {
	private final CommerceRecordRepository commerceRecords;

	public EasterEggController(CommerceRecordRepository commerceRecords) {
		this.commerceRecords = commerceRecords;
	}

	private static final List<VulnerabilityBucket> BUCKETS = List.of(
		new VulnerabilityBucket("xss", "XSS", 5),
		new VulnerabilityBucket("sqli", "SQL Injection", 5),
		new VulnerabilityBucket("idor", "IDOR", 6),
		new VulnerabilityBucket("jwt-auth", "JWT/Auth", 6),
		new VulnerabilityBucket("file-upload", "File Upload", 4),
		new VulnerabilityBucket("ssrf", "SSRF", 3),
		new VulnerabilityBucket("coupon-payment", "Coupon/Payment", 6),
		new VulnerabilityBucket("csrf", "CSRF", 3),
		new VulnerabilityBucket("access-control", "Access Control", 5),
		new VulnerabilityBucket("info-disclosure", "Info Disclosure", 4),
		new VulnerabilityBucket("business-logic", "Business Logic", 3)
	);

	@GetMapping("/progress")
	public ApiResponse<Map<String, Object>> progress() {
		List<Map<String, Object>> buckets = BUCKETS.stream().map(bucket -> {
			long found = Math.min(bucket.total(), commerceRecords.countByDomainTypeAndRecordKeyStartingWith("VULN_DISCOVERY", bucket.key() + ":"));
			return Map.<String, Object>of(
				"key", bucket.key(),
				"label", bucket.label(),
				"found", found,
				"total", bucket.total()
			);
		}).toList();
		long foundTotal = buckets.stream().mapToLong(bucket -> ((Number) bucket.get("found")).longValue()).sum();
		int total = BUCKETS.stream().mapToInt(VulnerabilityBucket::total).sum();
		return ApiResponse.accepted("Vulnerability discovery progress is ready.", Map.of(
			"found", foundTotal,
			"total", total,
			"buckets", buckets
		));
	}

	@PostMapping("/progress/{bucketKey}/discover")
	public ApiResponse<Map<String, Object>> discover(@PathVariable String bucketKey) {
		VulnerabilityBucket bucket = BUCKETS.stream()
			.filter(item -> item.key().equals(bucketKey))
			.findFirst()
			.orElseThrow();
		long found = commerceRecords.countByDomainTypeAndRecordKeyStartingWith("VULN_DISCOVERY", bucket.key() + ":");
		if (found < bucket.total()) {
			commerceRecords.save(CommerceRecordEntity.create(
				"VULN_DISCOVERY",
				"GLOBAL",
				bucket.key() + ":" + Instant.now().toEpochMilli(),
				"FOUND",
				Map.of("bucket", bucket.key(), "label", bucket.label())
			));
			found += 1;
		}
		return ApiResponse.accepted("Discovery progress updated.", Map.of(
			"key", bucket.key(),
			"label", bucket.label(),
			"found", found,
			"total", bucket.total()
		));
	}

	private record VulnerabilityBucket(String key, String label, int total) {
	}
}
