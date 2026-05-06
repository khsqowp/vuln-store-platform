package com.vul.shop.api;

import com.vul.shop.common.ApiResponse;
import com.vul.shop.domain.commerce.CommerceRecordEntity;
import com.vul.shop.domain.commerce.CommerceRecordRepository;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UploadListingController {
	private final CommerceRecordRepository commerceRecords;

	public UploadListingController(CommerceRecordRepository commerceRecords) {
		this.commerceRecords = commerceRecords;
	}

	@GetMapping("/uploads/reviews/")
	public ApiResponse<Map<String, Object>> reviewDirectory() {
		List<String> files = commerceRecords.findByDomainTypeOrderByCreatedAtDesc("FILE_UPLOAD").stream()
			.filter(record -> record.getPayloadJson().contains("\"usage\":\"reviews\"") || record.getPayloadJson().contains("/uploads/reviews/"))
			.map(CommerceRecordEntity::getPayloadJson)
			.toList();
		return ApiResponse.accepted("Directory listing enabled.", Map.of(
			"path", "/uploads/reviews/",
			"files", files,
			"diagnosticNote", "VULN-039 exposes the review upload directory listing."
		));
	}

	@GetMapping("/uploads/temp/")
	public ApiResponse<Map<String, Object>> tempDirectory() {
		List<String> files = commerceRecords.findByDomainTypeOrderByCreatedAtDesc("FILE_UPLOAD").stream()
			.filter(record -> record.getPayloadJson().contains("\"usage\":\"temp\"") || record.getPayloadJson().contains("/uploads/temp/"))
			.map(CommerceRecordEntity::getPayloadJson)
			.toList();
		return ApiResponse.accepted("Directory listing enabled.", Map.of(
			"path", "/uploads/temp/",
			"files", files,
			"diagnosticNote", "VULN-039 exposes the temp upload directory listing."
		));
	}
}
