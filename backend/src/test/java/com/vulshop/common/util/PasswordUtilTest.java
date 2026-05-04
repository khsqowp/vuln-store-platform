package com.vulshop.common.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordUtilTest {

    @Test
    @DisplayName("비밀번호 인코딩 및 검증 테스트")
    void encodeAndMatch() {
        // given
        String rawPassword = "mySecretPassword123!";

        // when
        String encodedPassword = PasswordUtil.encode(rawPassword);

        // then
        assertNotNull(encodedPassword);
        assertNotEquals(rawPassword, encodedPassword);
        assertTrue(PasswordUtil.matches(rawPassword, encodedPassword));
        assertFalse(PasswordUtil.matches("wrongPassword", encodedPassword));
    }
}
