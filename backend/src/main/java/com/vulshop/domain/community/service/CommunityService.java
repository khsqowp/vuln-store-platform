package com.vulshop.domain.community.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.community.dto.PostCreateRequest;
import com.vulshop.domain.community.dto.PostResponse;
import com.vulshop.domain.community.entity.Post;
import com.vulshop.domain.community.repository.PostRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostResponse createPost(Long userId, PostCreateRequest request) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 취약점 4: Stored XSS
        // request.getContent()에 담겨오는 HTML 문자열(스크립트 포함)을 
        // Jsoup, OWASP Java HTML Sanitizer 등으로 이스케이프/검증하지 않고 그대로 저장
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent()) 
                .author(author)
                .build();

        postRepository.save(post);
        return PostResponse.from(post);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllWithAuthor().stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        
        // 반환되는 PostResponse 내부에 authorDetails(User 전체)가 포함됨 (취약점 46 트리거)
        return PostResponse.from(post);
    }
}
