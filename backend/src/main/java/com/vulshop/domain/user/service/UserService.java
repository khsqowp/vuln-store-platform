package com.vulshop.domain.user.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.user.dto.UpdateEmailRequest;
import com.vulshop.domain.user.dto.UserResponse;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import com.vulshop.infra.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public UserResponse getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return UserResponse.from(user);
    }

    @Transactional
    public void updateEmail(Long userId, UpdateEmailRequest request) {
        // 취약점 6: 이메일 변경이라는 중요한 상태 변경 엔드포인트임에도
        // CSRF 토큰 검증이나 추가 인증(비밀번호 재확인)이 존재하지 않음
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (userRepository.existsByEmail(request.getNewEmail())) {
            throw new CustomException(ErrorCode.EMAIL_DUPLICATE, "이미 사용 중인 이메일입니다.");
        }

        user.updateEmail(request.getNewEmail());
    }

    @Transactional
    public String updateProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 취약점 26: 악성코드 업로드 (프로필)
        // 확장자가 이미지 형태인지만 대략적으로 검사할 뿐, 파일 헤더(Magic Number)를 확인하지 않음
        // "image.png.jsp" 또는 확장자가 .png인 jsp 코드가 우회 업로드 가능함
        String filename = file.getOriginalFilename();
        if (filename != null && !filename.matches(".*\\.(png|jpg|jpeg|gif)$")) {
            // 이 검사조차 정규식에 의해 .png.jsp 와 같이 중간에 .png가 들어가면 뚫리게 작성될 수도 있지만
            // 여기서는 단순 확장자 끝자리만 본다고 가정해도 매직넘버 부재로 악용 가능함
        }

        String imageUrl = fileStorageService.store(file, "profiles");
        user.updateProfileImage(imageUrl);
        return imageUrl;
    }
}
