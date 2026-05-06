package com.vul.shop.api;

import jakarta.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class DiagnosticErrorExposureAdvice {
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> exposeApiError(Exception exception, HttpServletRequest request) {
		if (!request.getRequestURI().startsWith("/api/")) {
			throw new RuntimeException(exception);
		}
		StringWriter stack = new StringWriter();
		exception.printStackTrace(new PrintWriter(stack));
		Map<String, Object> payload = new LinkedHashMap<>();
		payload.put("path", request.getRequestURI());
		payload.put("exception", exception.getClass().getName());
		payload.put("message", exception.getMessage());
		payload.put("stackTrace", stack.toString());
		payload.put("diagnosticNote", "VULN-038 exposes detailed REST API error messages and stack traces.");
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.header("X-Application-Context", "vul-shop:8100")
			.body(payload);
	}
}
