package com.vul.shop.api;

import com.vul.shop.common.ApiResponse;
import com.vul.shop.domain.commerce.CommerceRecordRepository;
import com.vul.shop.vulnerability.VulnerabilityCatalogService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/easter-egg")
public class EasterEggController {
	private final CommerceRecordRepository commerceRecords;
	private final VulnerabilityDiscoveryService discoveryService;
	private final VulnerabilityCatalogService catalogService;

	public EasterEggController(CommerceRecordRepository commerceRecords, VulnerabilityDiscoveryService discoveryService, VulnerabilityCatalogService catalogService) {
		this.commerceRecords = commerceRecords;
		this.discoveryService = discoveryService;
		this.catalogService = catalogService;
	}

	@GetMapping("/progress")
	public ApiResponse<Map<String, Object>> progress() {
		List<Map<String, Object>> buckets = VulnerabilityDiscoveryService.BUCKETS.stream().map(bucket -> {
			long found = Math.min(bucket.total(), commerceRecords.countByDomainTypeAndRecordKeyStartingWith("VULN_DISCOVERY", bucket.key() + ":"));
			return Map.<String, Object>of(
				"key", bucket.key(),
				"label", bucket.label(),
				"found", found,
				"total", bucket.total()
			);
		}).toList();
		long foundTotal = buckets.stream().mapToLong(bucket -> ((Number) bucket.get("found")).longValue()).sum();
		int total = VulnerabilityDiscoveryService.BUCKETS.stream().mapToInt(VulnerabilityDiscoveryService.VulnerabilityBucket::total).sum();
		return ApiResponse.accepted("Vulnerability discovery progress is ready.", Map.of(
			"found", foundTotal,
			"total", total,
			"buckets", buckets
		));
	}

	@PostMapping("/progress/{bucketKey}/discover")
	public ApiResponse<Map<String, Object>> discover(@PathVariable String bucketKey, @RequestBody(required = false) Map<String, Object> request) {
		String signal = request == null ? "" : String.valueOf(request.getOrDefault("signal", ""));
		return ApiResponse.accepted("Discovery progress updated.", discoveryService.discover(bucketKey, signal));
	}

	@GetMapping("/challenges")
	public ApiResponse<List<Map<String, Object>>> challenges() {
		List<Map<String, Object>> result = catalogService.findAll().stream().map(scenario -> {
			boolean discovered = discoveryService.isChallengeDiscovered(scenario.id());
			return Map.<String, Object>of(
				"id", scenario.id(),
				"title", scenario.title(),
				"type", scenario.type(),
				"location", scenario.location(),
				"severity", scenario.severity(),
				"difficulty", scenario.difficulty(),
				"bucketKey", VulnerabilityDiscoveryService.CHALLENGE_MAP.getOrDefault(scenario.id(), ""),
				"discovered", discovered,
				"endpointHints", scenario.endpointHints()
			);
		}).toList();
		return ApiResponse.accepted("Challenge list ready.", result);
	}
}
