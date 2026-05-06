package com.vul.shop.domain.commerce;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "commerce_records")
public class CommerceRecordEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 50)
	private String domainType;

	@Column(nullable = false, length = 160)
	private String ownerKey;

	@Column(nullable = false, length = 80)
	private String recordKey;

	@Column(nullable = false, length = 40)
	private String status;

	@Lob
	@Column(nullable = false, columnDefinition = "LONGTEXT")
	private String payloadJson;

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public static CommerceRecordEntity create(String domainType, String ownerKey, String recordKey, String status, Map<String, Object> payload) {
		CommerceRecordEntity record = new CommerceRecordEntity();
		record.domainType = domainType;
		record.ownerKey = ownerKey;
		record.recordKey = recordKey;
		record.status = status;
		record.payloadJson = toJson(payload);
		return record;
	}

	public void changeStatus(String status) {
		this.status = status;
	}

	public void replacePayload(Map<String, Object> payload) {
		this.payloadJson = toJson(payload);
	}

	private static String toJson(Map<String, Object> payload) {
		StringBuilder builder = new StringBuilder("{");
		int index = 0;
		for (Map.Entry<String, Object> entry : payload.entrySet()) {
			if (index > 0) {
				builder.append(',');
			}
			builder.append('"').append(escape(entry.getKey())).append('"').append(':');
			Object value = entry.getValue();
			if (value instanceof Number || value instanceof Boolean) {
				builder.append(value);
			} else {
				builder.append('"').append(escape(String.valueOf(value))).append('"');
			}
			index += 1;
		}
		return builder.append('}').toString();
	}

	private static String escape(String value) {
		return value.replace("\\", "\\\\").replace("\"", "\\\"");
	}

	public Long getId() {
		return id;
	}

	public String getDomainType() {
		return domainType;
	}

	public String getOwnerKey() {
		return ownerKey;
	}

	public String getRecordKey() {
		return recordKey;
	}

	public String getStatus() {
		return status;
	}

	public String getPayloadJson() {
		return payloadJson;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
