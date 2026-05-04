package com.vulshop.domain.product.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.product.dto.ProductResponse;
import com.vulshop.domain.product.entity.Product;
import com.vulshop.domain.product.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<ProductResponse> getProducts(String sort) {
        // 취약점 9: SQL Injection (Raw Query)
        // JPA/Hibernate를 사용함에도 불구하고 의도적으로 createNativeQuery를 사용하며
        // sort 파라미터를 파라미터 바인딩(?) 없이 문자열 연결(concatenation)로 직접 주입함.
        // 공격자는 ?sort=id DESC; SELECT ... 형식으로 쿼리 조작 가능.
        
        String sql = "SELECT * FROM products";
        if (sort != null && !sort.trim().isEmpty()) {
            sql += " ORDER BY " + sort; 
        }

        Query query = entityManager.createNativeQuery(sql, Product.class);
        List<Product> products = query.getResultList();

        return products.stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        return products.stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategory(category);
        
        if (products.isEmpty()) {
            // 취약점 8: Reflected XSS (Path Variable)
            // 사용자 입력(category)을 아무런 이스케이프 처리 없이 에러 메시지에 그대로 삽입.
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND, "Category '" + category + "' not found.");
        }
        
        return products.stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
        return ProductResponse.from(product);
    }
}
