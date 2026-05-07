package com.vul.shop.config;

import com.vul.shop.api.VulnerabilityDiscoveryService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class SecurityConfig {
	private final VulnerabilityDiscoveryService discovery;

	public SecurityConfig(VulnerabilityDiscoveryService discovery) {
		this.discovery = discovery;
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
			.csrf(csrf -> csrf.disable())
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.headers(headers -> headers.frameOptions(frame -> frame.disable()))
			.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
			.addFilterBefore(new DiagnosticJwtFilter(discovery), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
			.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowCredentials(true);
		configuration.addAllowedOriginPattern("*.shop.com");
		configuration.addAllowedOriginPattern("http://localhost:*");
		configuration.addAllowedOriginPattern("http://127.0.0.1:*");
		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod(HttpMethod.GET);
		configuration.addAllowedMethod(HttpMethod.POST);
		configuration.addAllowedMethod(HttpMethod.PUT);
		configuration.addAllowedMethod(HttpMethod.DELETE);
		configuration.addExposedHeader("X-Application-Context");
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	static class DiagnosticJwtFilter extends OncePerRequestFilter {
		private final VulnerabilityDiscoveryService discovery;

		DiagnosticJwtFilter(VulnerabilityDiscoveryService discovery) {
			this.discovery = discovery;
		}

		@Override
		protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
			String path = request.getRequestURI();
			String origin = request.getHeader("Origin");
			if (origin != null && (origin.endsWith(".shop.com") || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) {
				discovery.discover("info-disclosure", "weak-cors-configuration");
			}
			discovery.discover("info-disclosure", "response-header-disclosure");
			if (path.startsWith("/api/users/me") || path.startsWith("/api/orders/checkout")) {
				discovery.discover("info-disclosure", "weak-cache-control");
			}
			discovery.discover("info-disclosure", "clickjacking-frame-options-disabled");
			response.setHeader("Server", "Apache Tomcat/10.1.54");
			response.setHeader("X-Powered-By", "Spring Boot 3.5.14");
			response.setHeader("X-Application-Context", "vul-shop:8100");
			if (path.startsWith("/api/users/me") || path.startsWith("/api/orders/checkout")) {
				response.setHeader("Cache-Control", "no-cache, private");
				response.setHeader("Pragma", "no-cache");
			}
			if ("OPTIONS".equalsIgnoreCase(request.getMethod()) && (path.startsWith("/api/products/") || path.startsWith("/api/orders/"))) {
				response.setHeader("Allow", "GET,POST,PUT,DELETE,OPTIONS");
			}
			if (path.startsWith("/api/admin") && diagnosticAdminBypass(request)) {
				discovery.discover("access-control", "admin-auth-bypass-debug-header");
			}
			if (path.startsWith("/api/admin") && !diagnosticAdminBypass(request) && !tokenContains(request, "\"role\":\"ADMIN\"")) {
				response.sendError(HttpServletResponse.SC_FORBIDDEN, "diagnostic admin token required");
				return;
			}
			if (requiresMember(path) && request.getHeader("Authorization") == null) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "diagnostic bearer token required");
				return;
			}
			filterChain.doFilter(request, response);
		}

		private static boolean requiresMember(String path) {
			return path.startsWith("/api/cart")
				|| path.startsWith("/api/orders")
				|| path.startsWith("/api/mileage")
				|| path.startsWith("/api/seller");
		}

		private static boolean diagnosticAdminBypass(HttpServletRequest request) {
			return "true".equalsIgnoreCase(request.getHeader("X-Debug-Admin"))
				|| "ADMIN".equalsIgnoreCase(request.getHeader("X-User-Role"))
				|| "true".equalsIgnoreCase(request.getParameter("debugAdmin"));
		}

		private static boolean tokenContains(HttpServletRequest request, String expected) {
			String authorization = request.getHeader("Authorization");
			if (authorization == null || !authorization.startsWith("Bearer ")) {
				return false;
			}
			String[] chunks = authorization.substring(7).split("\\.");
			if (chunks.length < 2) {
				return false;
			}
			try {
				String payload = new String(Base64.getUrlDecoder().decode(chunks[1]), StandardCharsets.UTF_8);
				return payload.contains(expected);
			} catch (IllegalArgumentException exception) {
				return false;
			}
		}
	}
}
