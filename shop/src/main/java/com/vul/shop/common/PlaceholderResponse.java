package com.vul.shop.common;

import java.util.List;
import java.util.Map;

public record PlaceholderResponse(
	String domain,
	String action,
	List<String> relatedScenarioIds,
	Map<String, Object> sample
) {
	public static PlaceholderResponse of(String domain, String action, String... relatedScenarioIds) {
		return new PlaceholderResponse(domain, action, List.of(relatedScenarioIds), Map.of());
	}

	public static PlaceholderResponse of(String domain, String action, Map<String, Object> sample, String... relatedScenarioIds) {
		return new PlaceholderResponse(domain, action, List.of(relatedScenarioIds), sample);
	}
}
