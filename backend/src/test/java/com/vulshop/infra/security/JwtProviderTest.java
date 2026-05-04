package com.vulshop.infra.security;

import com.vulshop.common.config.JwtConfig;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class JwtProviderTest {

    private JwtProvider jwtProvider;
    private JwtConfig jwtConfig;

    @BeforeEach
    void setUp() {
        jwtConfig = new JwtConfig();
        jwtConfig.setSecret("VulShop2024!ThisIsASecretKeyForTestingPurposeOnly!");
        jwtConfig.setAccessTokenExpiry(1800000L); // 30분
        jwtConfig.setRefreshTokenExpiry(604800000L); // 7일
        jwtConfig.setIssuer("vulshop.com");

        jwtProvider = new JwtProvider(jwtConfig);
    }

    @Test
    @DisplayName("액세스 토큰 생성 및 파싱 테스트")
    void createAndParseAccessToken() {
        // given
        Long userId = 1L;
        String email = "test@vulshop.com";
        String role = "ROLE_USER";

        // when
        String token = jwtProvider.createAccessToken(userId, email, role);
        boolean isValid = jwtProvider.validateToken(token);

        // then
        assertTrue(isValid);
        assertEquals(userId, jwtProvider.getUserId(token));
        assertEquals(email, jwtProvider.getEmail(token));
        assertEquals(role, jwtProvider.getRole(token));
    }

    @Test
    @DisplayName("서명 없는 토큰(alg: none) 허용 취약점 동작 확인 테스트")
    void allowUnsignedToken_Vuln_Test() {
        // given: 서명이 없는 토큰 (alg: none)
        String header = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"alg\":\"none\"}".getBytes());
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"sub\":\"999\",\"role\":\"ROLE_ADMIN\",\"email\":\"hacker@vulshop.com\"}".getBytes());
        String unsignedToken = header + "." + payload + ".";

        // when
        boolean isValid = jwtProvider.validateToken(unsignedToken);

        // then
        assertTrue(isValid, "취약점 4-2: 서명 없는 토큰이 유효한 것으로 처리되어야 함");
        assertEquals(999L, jwtProvider.getUserId(unsignedToken));
        assertEquals("ROLE_ADMIN", jwtProvider.getRole(unsignedToken));
    }
}
