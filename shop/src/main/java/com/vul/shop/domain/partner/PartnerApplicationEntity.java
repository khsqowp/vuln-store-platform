package com.vul.shop.domain.partner;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "partner_applications")
public class PartnerApplicationEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 120)
	private String companyName;

	@Column(nullable = false, length = 80)
	private String ownerName;

	@Column(nullable = false, length = 160)
	private String email;

	@Column(nullable = false, length = 40)
	private String phone;

	@Column(nullable = false, length = 60)
	private String businessNo;

	@Column(nullable = false, length = 80)
	private String salesCategory;

	@Column(nullable = false, length = 30)
	private String status = "PENDING";

	@Column(length = 1000)
	private String memo;

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public static PartnerApplicationEntity from(Map<String, Object> request) {
		PartnerApplicationEntity partner = new PartnerApplicationEntity();
		partner.companyName = stringValue(request, "companyName");
		partner.ownerName = stringValue(request, "ownerName");
		partner.email = stringValue(request, "email");
		partner.phone = stringValue(request, "phone");
		partner.businessNo = stringValue(request, "businessNo");
		partner.salesCategory = stringValue(request, "salesCategory");
		partner.memo = stringValue(request, "memo");
		return partner;
	}

	public void approve() {
		this.status = "APPROVED";
	}

	public void reject() {
		this.status = "REJECTED";
	}

	public void revoke() {
		this.status = "REVOKED";
	}

	public void suspend() {
		this.status = "SUSPENDED";
	}

	private static String stringValue(Map<String, Object> request, String key) {
		return String.valueOf(request.getOrDefault(key, ""));
	}

	public Long getId() {
		return id;
	}

	public String getCompanyName() {
		return companyName;
	}

	public String getOwnerName() {
		return ownerName;
	}

	public String getEmail() {
		return email;
	}

	public String getPhone() {
		return phone;
	}

	public String getBusinessNo() {
		return businessNo;
	}

	public String getSalesCategory() {
		return salesCategory;
	}

	public String getStatus() {
		return status;
	}

	public String getMemo() {
		return memo;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
