package com.vulshop.common.util;

import com.vulshop.common.config.JwtConfig;
import com.vulshop.infra.security.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtProvider jwtProvider;
    private final JwtConfig jwtConfig;

    public String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    public boolean isValid(String token) {
        return jwtProvider.validateToken(token);
    }

    public Long getUserId(String token) {
        return jwtProvider.getUserId(token);
    }

    public String getRole(String token) {
        return jwtProvider.getRole(token);
    }
}
