package com.vulshop.domain.product.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.product.dto.ProductResponse;
import com.vulshop.domain.product.entity.Product;
import com.vulshop.domain.product.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    @Test
    @DisplayName("상품 목록 조회 성공 - SQLi 취약 쿼리 결합 검증")
    void getProducts_Success_With_SQLi() {
        // given
        String maliciousSort = "created_at DESC; DROP TABLE products; --";
        Product mockProduct = Product.builder().name("Mock").price(1000).stockQuantity(10).category("tops").build();
        
        given(entityManager.createNativeQuery(anyString(), eq(Product.class))).willReturn(query);
        given(query.getResultList()).willReturn(List.of(mockProduct));

        // when
        List<ProductResponse> responses = productService.getProducts(maliciousSort);

        // then
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Mock", responses.get(0).getName());
        // 실제 테스트 환경(H2 등)에 쿼리가 그대로 날아가는 것은 통합 테스트에서 확인
    }

    @Test
    @DisplayName("카테고리 조회 실패 시 Reflected XSS 취약 메시지 발생")
    void getProductsByCategory_Fail_ReflectedXSS() {
        // given
        String maliciousCategory = "<script>alert(1)</script>";
        given(productRepository.findByCategory(maliciousCategory)).willReturn(Collections.emptyList());

        // when & then
        CustomException exception = assertThrows(CustomException.class, 
                () -> productService.getProductsByCategory(maliciousCategory));
                
        assertEquals(ErrorCode.PRODUCT_NOT_FOUND, exception.getErrorCode());
        // 취약점: 카테고리 이름이 메시지에 이스케이프 없이 그대로 포함되는지 확인
        assertTrue(exception.getMessage().contains(maliciousCategory));
    }
}
