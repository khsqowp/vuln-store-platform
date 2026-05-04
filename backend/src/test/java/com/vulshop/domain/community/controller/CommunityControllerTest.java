package com.vulshop.domain.community.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vulshop.domain.community.dto.PostCreateRequest;
import com.vulshop.domain.community.entity.Post;
import com.vulshop.domain.community.repository.PostRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import com.vulshop.infra.security.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CommunityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private JwtProvider jwtProvider;

    private String accessToken;
    private Long testPostId;

    @BeforeEach
    void setUp() {
        User user = User.builder()
                .email("comm@vulshop.com")
                .password("testpass")
                .name("커뮤유저")
                .role("ROLE_USER")
                .build();
        userRepository.save(user);

        accessToken = jwtProvider.createAccessToken(user.getId(), user.getEmail(), user.getRole());

        Post post = Post.builder()
                .title("테스트 제목")
                .content("<script>alert('test')</script>")
                .author(user)
                .build();
        postRepository.save(post);
        testPostId = post.getId();
    }

    @Test
    @DisplayName("게시글 상세 조회 - 응답 내 민감정보 과도 노출 검증 (취약점 46)")
    void getPost_ExposesSensitiveUserInfo() throws Exception {
        mockMvc.perform(get("/api/v1/community/posts/" + testPostId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.authorDetails").exists())
                .andExpect(jsonPath("$.data.authorDetails.password").exists()) // 패스워드가 반환됨을 확인
                .andExpect(jsonPath("$.data.content").value("<script>alert('test')</script>")); // XSS 필터링 안됨
    }

    @Test
    @DisplayName("게시글 작성 - HTML 스크립트 그대로 저장됨 (취약점 4)")
    void createPost_StoredXSS() throws Exception {
        PostCreateRequest request = new PostCreateRequest();
        request.setTitle("악성 게시글");
        String maliciousHtml = "<img src='x' onerror='alert(document.cookie)'>";
        request.setContent(maliciousHtml);

        mockMvc.perform(post("/api/v1/community/posts")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").value(maliciousHtml));
    }
}
