package com.vulshop.domain.review.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.product.entity.Product;
import com.vulshop.domain.product.repository.ProductRepository;
import com.vulshop.domain.review.dto.ReviewCreateRequest;
import com.vulshop.domain.review.dto.ReviewResponse;
import com.vulshop.domain.review.entity.Review;
import com.vulshop.domain.review.repository.ReviewRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // 취약점 26 (파일 업로드 확장자 우회)
    // 파일의 Content-Type이나 Magic Number를 검증하지 않고 
    // 오직 파일명의 확장자만을 (느슨하게) 확인하거나 아예 확인하지 않음.
    // evil.jpg.jsp 또는 Content-Type 조작을 통한 서버사이드 스크립트 업로드 가능.
    private static final String UPLOAD_DIR = "/tmp/vulshop/reviews/";

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewCreateRequest request, MultipartFile imageFile) throws IOException {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        String savedImageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // 취약점 26: 파일 확장자만 체크하고 실제 바이트(Magic Number)는 검증하지 않음
            // .jpg, .png 등의 확장자만 허용하는 척하지만, 
            // 실제로는 originalFilename을 그대로 사용하여 ".jsp" 이중 확장자를 막지 못함
            String originalFilename = imageFile.getOriginalFilename();
            
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // 파일명 그대로 사용(경로 조작 취약점도 존재)
            String savedFilename = UUID.randomUUID() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(savedFilename);
            imageFile.transferTo(filePath.toFile());
            
            savedImageUrl = "/uploads/reviews/" + savedFilename;
        } else {
            savedImageUrl = request.getImageUrl();
        }

        // 취약점 7 (Stored XSS): content를 sanitize 없이 DB에 저장
        Review review = Review.builder()
                .product(product)
                .author(author)
                .rating(request.getRating())
                .content(request.getContent())
                .imageUrl(savedImageUrl)
                .build();

        reviewRepository.save(review);
        return ReviewResponse.from(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }
}
