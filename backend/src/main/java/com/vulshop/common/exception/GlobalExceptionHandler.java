package com.vulshop.common.exception;

import com.vulshop.common.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        log.warn("Business exception: {}", e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode.getCode(), e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst()
                .orElse("입력값 검증에 실패했습니다");
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error("C001", message));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Void>> handleBindException(BindException e) {
        String message = e.getFieldError() != null
                ? e.getFieldError().getDefaultMessage()
                : "입력값이 올바르지 않습니다";
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error("C001", message));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFoundException(NoHandlerFoundException e) {
        return ResponseEntity
                .status(404)
                .body(ApiResponse.error("C004", "요청한 리소스를 찾을 수 없습니다"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unexpected error: {}", e.getClass().getSimpleName(), e);
        return ResponseEntity
                .internalServerError()
                .body(ApiResponse.error("C003", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요"));
    }
}
