package com.vulshop.infra.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vulshop.common.response.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);

        if (StringUtils.hasText(token)) {
            try {
                if (jwtProvider.validateToken(token)) {
                    Long userId = jwtProvider.getUserId(token);
                    String role = jwtProvider.getRole(token);
                    String email = jwtProvider.getEmail(token);

                    CustomUserDetails userDetails = CustomUserDetails.of(userId, email, role);
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null,
                                    List.of(new SimpleGrantedAuthority(role)));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (ExpiredJwtException e) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "A001", "토큰이 만료되었습니다");
                return;
            } catch (Exception e) {
                log.debug("JWT processing failed: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    private void sendErrorResponse(HttpServletResponse response, int status,
                                   String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
                objectMapper.writeValueAsString(ApiResponse.error(code, message))
        );
    }
}
