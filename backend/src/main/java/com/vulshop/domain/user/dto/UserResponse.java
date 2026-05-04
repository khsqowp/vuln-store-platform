package com.vulshop.domain.user.dto;

import com.vulshop.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String role;
    private String profileImageUrl;
    private Integer mileage;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole())
                .profileImageUrl(user.getProfileImageUrl())
                .mileage(user.getMileage())
                .build();
    }
}
