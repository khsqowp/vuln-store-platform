package com.vulshop.domain.cs.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.cs.dto.InquiryCreateRequest;
import com.vulshop.domain.cs.dto.InquiryResponse;
import com.vulshop.domain.cs.entity.Inquiry;
import com.vulshop.domain.cs.repository.InquiryRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CsService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    @Transactional
    public InquiryResponse createInquiry(Long userId, InquiryCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        inquiryRepository.save(inquiry);
        return InquiryResponse.from(inquiry);
    }

    @Transactional(readOnly = true)
    public List<InquiryResponse> getMyInquiries(Long userId) {
        return inquiryRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(InquiryResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InquiryResponse getInquiry(Long userId, Long inquiryId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 취약점 2 (IDOR 반복 패턴): 본인 문의인지 확인하는 로직 미구현
        // 타인의 1:1 문의 내용(민감한 배송지, 개인정보 포함 가능)을 inquiryId 조작으로 열람 가능
        return InquiryResponse.from(inquiry);
    }
}
