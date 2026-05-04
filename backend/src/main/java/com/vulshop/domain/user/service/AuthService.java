package com.vulshop.domain.user.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.common.util.PasswordUtil;
import com.vulshop.domain.user.dto.AuthResponse;
import com.vulshop.domain.user.dto.LoginRequest;
import com.vulshop.domain.user.dto.RegisterRequest;
import com.vulshop.domain.user.dto.UserResponse;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import com.vulshop.infra.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    // 취약점 24 (ReDoS): 극단적인 백트래킹을 유발하는 정규식
    private static final String VULNERABLE_EMAIL_REGEX = "^([a-zA-Z0-9])(([\\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.][a-z]{2,3}$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(VULNERABLE_EMAIL_REGEX);

    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 1. 이메일 유효성 검증 (ReDoS 취약점 발동 지점)
        if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "올바른 이메일 형식이 아닙니다.");
        }

        // 2. 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_DUPLICATE);
        }

        // 3. 비밀번호 검증 누락 (취약점 30: 정책 없음)
        // 최소 길이, 특수문자 조합 등을 확인하지 않음 (예: "1234" 허용)

        User user = User.builder()
                .email(request.getEmail())
                .password(PasswordUtil.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .role("ROLE_USER")
                .build();

        userRepository.save(user);

        return UserResponse.from(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String redirectUrl) {
        // 취약점 31: Brute Force 공격 방어를 위한 실패 카운트/잠금 로직 부재

        // 취약점 32: 계정 정보 파악 가능 (존재하지 않는 사용자 vs 비밀번호 오류 메시지 분리)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 이메일입니다."));

        if (!PasswordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD, "비밀번호가 일치하지 않습니다.");
        }

        if (!user.isActive()) {
            throw new CustomException(ErrorCode.ACCESS_DENIED, "정지된 계정입니다.");
        }

        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtProvider.createRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponse.from(user))
                .redirectUrl(redirectUrl) // 취약점 21
                .build();
    }
}
