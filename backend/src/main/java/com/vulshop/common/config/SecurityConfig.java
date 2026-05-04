package com.vulshop.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vulshop.infra.security.JwtFilter;
import com.vulshop.infra.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 공개 API
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/v1/products/**",
                                "/api/v1/categories/**",
                                "/api/v1/reviews/product/**",
                                "/api/v1/community/**",
                                "/api/v1/events/**",
                                "/api/v1/cs/faq/**",
                                "/api/v1/search/**",
                                "/api/v1/health"
                        ).permitAll()
                        // API 문서
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        // Actuator — 내부 모니터링용 (인증 없이 접근 가능)
                        .requestMatchers("/actuator/**").permitAll()
                        // H2 콘솔 (개발 환경)
                        .requestMatchers("/h2-console/**").permitAll()
                        // 관리자
                        .requestMatchers("/api/v1/admin/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                        // 판매자
                        .requestMatchers("/api/v1/seller/**").hasAnyRole("SELLER", "ADMIN", "MANAGER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(jwtProvider, objectMapper),
                        UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
