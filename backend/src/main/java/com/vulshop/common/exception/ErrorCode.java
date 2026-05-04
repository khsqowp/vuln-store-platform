package com.vulshop.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력값입니다"),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST, "C002", "잘못된 타입입니다"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C003", "서버 내부 오류가 발생했습니다"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "C004", "리소스를 찾을 수 없습니다"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "C005", "접근 권한이 없습니다"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "C006", "인증이 필요합니다"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "C007", "잘못된 요청입니다"),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "존재하지 않는 사용자입니다"),
    EMAIL_DUPLICATE(HttpStatus.CONFLICT, "U002", "이미 사용 중인 이메일입니다"),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "U003", "비밀번호가 일치하지 않습니다"),
    USER_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "U004", "이미 탈퇴한 사용자입니다"),

    // Auth
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "A001", "토큰이 만료되었습니다"),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "A002", "유효하지 않은 토큰입니다"),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "A003", "리프레시 토큰이 없습니다"),

    // Product
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "존재하지 않는 상품입니다"),
    PRODUCT_OUT_OF_STOCK(HttpStatus.BAD_REQUEST, "P002", "재고가 부족합니다"),

    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "O001", "존재하지 않는 주문입니다"),
    ORDER_CANCEL_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "O002", "취소할 수 없는 주문입니다"),

    // File
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "F001", "파일 업로드에 실패했습니다"),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "F002", "파일을 찾을 수 없습니다"),

    // Seller
    SELLER_APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "S001", "판매자 신청 정보를 찾을 수 없습니다"),
    SELLER_ALREADY_APPLIED(HttpStatus.CONFLICT, "S002", "이미 판매자 신청을 완료했습니다");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}
