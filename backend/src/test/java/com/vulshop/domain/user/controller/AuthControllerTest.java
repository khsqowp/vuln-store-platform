package com.vulshop.domain.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vulshop.domain.user.dto.LoginRequest;
import com.vulshop.domain.user.dto.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("회원가입 및 로그인 통합 테스트 (Redirect 취약점 포함)")
    void registerAndLogin() throws Exception {
        // 1. 회원가입
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("hacker@vulshop.com");
        registerRequest.setPassword("1234");
        registerRequest.setName("해커");
        registerRequest.setPhone("010-9999-9999");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 2. 로그인 (Redirect 파라미터 포함)
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("hacker@vulshop.com");
        loginRequest.setPassword("1234");

        String maliciousRedirect = "https://evil.com/phishing";

        mockMvc.perform(post("/api/v1/auth/login")
                        .param("redirect", maliciousRedirect)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.redirectUrl").value(maliciousRedirect)); // 취약점 21
    }
}
