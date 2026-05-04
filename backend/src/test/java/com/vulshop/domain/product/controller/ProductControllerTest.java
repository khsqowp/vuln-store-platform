package com.vulshop.domain.product.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("검색 API - Reflected XSS(취약점 1)")
    void search_ReflectedXSS() throws Exception {
        String xssPayload = "<script>alert('XSS')</script>";

        mockMvc.perform(get("/api/v1/search")
                        .param("q", xssPayload)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.searchKeyword").value(xssPayload));
    }

    @Test
    @DisplayName("상품 상세 API - 예외 발생 시 스택 트레이스 노출(취약점 48)")
    void getProductDetail_StackTraceLeak() throws Exception {
        mockMvc.perform(get("/api/v1/products/null")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // ApiResponse.error 처리를 하므로 HTTP 200에 성공 false로 오는지 확인
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("NumberFormatException")));
    }
}
