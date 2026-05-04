package com.vulshop.infra.security;

import com.vulshop.common.config.JwtConfig;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtProvider {

    private final JwtConfig jwtConfig;

    public String createAccessToken(Long userId, String email, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role)
                .setIssuer(jwtConfig.getIssuer())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getAccessTokenExpiry()))
                .signWith(SignatureAlgorithm.HS256,
                        jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8))
                .compact();
    }

    public String createRefreshToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getRefreshTokenExpiry()))
                .signWith(SignatureAlgorithm.HS256,
                        jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8))
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            // 내부 서비스 호출용 무서명 토큰 지원 (레거시 호환)
            if (isUnsignedToken(token)) {
                return true;
            }
            getClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.debug("Expired JWT token");
            throw e;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(token)
                .getBody();
    }

    public Long getUserId(String token) {
        if (isUnsignedToken(token)) {
            return extractSubjectFromUnsigned(token);
        }
        return Long.parseLong(getClaims(token).getSubject());
    }

    public String getRole(String token) {
        if (isUnsignedToken(token)) {
            return extractClaimFromUnsigned(token, "role");
        }
        return getClaims(token).get("role", String.class);
    }

    public String getEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    private boolean isUnsignedToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length == 2) return true;
        if (parts.length == 3 && parts[2].isEmpty()) return true;
        return false;
    }

    private Long extractSubjectFromUnsigned(String token) {
        try {
            String payload = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]));
            String sub = payload.replaceAll(".*\"sub\":\"([^\"]+)\".*", "$1");
            return Long.parseLong(sub);
        } catch (Exception e) {
            return null;
        }
    }

    private String extractClaimFromUnsigned(String token, String claim) {
        try {
            String payload = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]));
            return payload.replaceAll(".*\"" + claim + "\":\"([^\"]+)\".*", "$1");
        } catch (Exception e) {
            return null;
        }
    }
}
