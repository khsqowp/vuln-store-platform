package com.vulshop.domain.user.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.user.dto.AuthResponse;
import com.vulshop.domain.user.dto.LoginRequest;
import com.vulshop.domain.user.dto.RegisterRequest;
import com.vulshop.domain.user.dto.UserResponse;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import com.vulshop.infra.security.JwtProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtProvider jwtProvider;

    @Test
    @DisplayName("회원가입 성공 - 1234와 같은 취약한 비밀번호도 허용(취약점 30)")
    void register_Success() {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@vulshop.com");
        request.setPassword("1234");
        request.setName("테스터");
        request.setPhone("010-1234-5678");

        given(userRepository.existsByEmail(any())).willReturn(false);

        // when
        UserResponse response = authService.register(request);

        // then
        assertNotNull(response);
        assertEquals("test@vulshop.com", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("회원가입 실패 - Regex DoS 정규식으로 인한 이메일 형식 오류(취약점 24)")
    void register_Fail_InvalidEmail() {
        // given
        RegisterRequest request = new RegisterRequest();
        // 정규식에 어긋나는 복잡한 이메일 입력 (ReDoS 페이로드 유발 가능성)
        request.setEmail("test!@#$vulshop.com");
        request.setPassword("password");

        // when & then
        CustomException exception = assertThrows(CustomException.class, () -> authService.register(request));
        assertEquals(ErrorCode.INVALID_INPUT_VALUE, exception.getErrorCode());
    }

    @Test
    @DisplayName("로그인 실패 - 존재하지 않는 계정 시 명확한 에러 반환(취약점 32)")
    void login_Fail_UserNotFound() {
        // given
        LoginRequest request = new LoginRequest();
        request.setEmail("notfound@vulshop.com");
        request.setPassword("1234");

        given(userRepository.findByEmail(any())).willReturn(Optional.empty());

        // when & then
        CustomException exception = assertThrows(CustomException.class, () -> authService.login(request, null));
        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
        assertEquals("존재하지 않는 이메일입니다.", exception.getMessage());
    }
}
