package com.vul.shop.common;

public record ApiResponse<T>(
	String status,
	String message,
	T data
) {
	public static <T> ApiResponse<T> ok(String message, T data) {
		return new ApiResponse<>("OK", message, data);
	}

	public static <T> ApiResponse<T> accepted(String message, T data) {
		return new ApiResponse<>("ACCEPTED", message, data);
	}
}
