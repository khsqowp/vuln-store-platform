package com.vulshop.domain.seller.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.seller.dto.SellerApplyRequest;
import com.vulshop.domain.seller.entity.SellerApplication;
import com.vulshop.domain.seller.repository.SellerApplicationRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerApplicationRepository sellerApplicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void apply(Long userId, SellerApplyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (sellerApplicationRepository.findByUserId(userId).isPresent()) {
            throw new CustomException(ErrorCode.SELLER_ALREADY_APPLIED);
        }

        // 취약점 33 (입력값 검증 미흡): businessNumber 형식 검증 없이 저장
        SellerApplication application = SellerApplication.builder()
                .user(user)
                .brandName(request.getBrandName())
                .businessNumber(request.getBusinessNumber())
                .description(request.getDescription())
                .build();

        sellerApplicationRepository.save(application);
    }
}
