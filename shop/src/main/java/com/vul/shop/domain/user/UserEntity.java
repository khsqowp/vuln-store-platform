package com.vul.shop.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 80)
	private String name;

	@Column(nullable = false, unique = true, length = 160)
	private String email;

	@Column(nullable = false)
	private String passwordHash;

	@Column(length = 30)
	private String phone;

	@Column(length = 255)
	private String address;

	@Column(nullable = false, length = 30)
	private String role = "USER";

	@Column(nullable = false, length = 30)
	private String status = "ACTIVE";

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public static UserEntity create(String name, String email, String passwordHash, String phone, String address, String role) {
		UserEntity user = new UserEntity();
		user.name = name;
		user.email = email;
		user.passwordHash = passwordHash;
		user.phone = phone;
		user.address = address;
		user.role = role;
		user.status = "ACTIVE";
		return user;
	}

	public void changeStatus(String status) {
		this.status = status;
	}

	public void changeRole(String role) {
		this.role = role;
	}

	public void changePasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public String getPhone() {
		return phone;
	}

	public String getAddress() {
		return address;
	}

	public String getRole() {
		return role;
	}

	public String getStatus() {
		return status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
