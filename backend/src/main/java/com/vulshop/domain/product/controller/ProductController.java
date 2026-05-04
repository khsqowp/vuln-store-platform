package com.vulshop.domain.product.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.product.dto.ProductResponse;
import com.vulshop.domain.product.dto.SearchResponse;
import com.vulshop.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getProducts(
            @RequestParam(required = false, defaultValue = "created_at DESC") String sort) {
        return ApiResponse.ok(productService.getProducts(sort));
    }

    @GetMapping("/search")
    public ApiResponse<SearchResponse> search(@RequestParam(name = "q", defaultValue = "") String q) {
        List<ProductResponse> results = productService.searchProducts(q);
        
        // 취약점 1: Reflected XSS (Query String)
        // 입력받은 검색어 q를 필터링 없이 그대로 응답 객체에 담아 반환함.
        // 프론트에서 이를 dangerouslySetInnerHTML로 렌더링하면 XSS 발생.
        SearchResponse response = SearchResponse.builder()
                .searchKeyword(q)
                .results(results)
                .build();
                
        return ApiResponse.ok(response);
    }

    @GetMapping("/category/{name}")
    public ApiResponse<List<ProductResponse>> getByCategory(@PathVariable String name) {
        // 취약점 8: Service 단에서 해당 카테고리가 없을 경우 파라미터가 노출된 예외 발생
        return ApiResponse.ok(productService.getProductsByCategory(name));
    }

    @GetMapping("/products/{id}")
    public ApiResponse<?> getProductDetail(@PathVariable String id) {
        try {
            Long productId = Long.parseLong(id);
            return ApiResponse.ok(productService.getProductDetail(productId));
        } catch (NumberFormatException e) {
            // 취약점 48: 오류페이지 정보 노출
            // 사용자가 의도적으로 타입이 맞지 않는 값(예: "null" 또는 문자열)을 파라미터로 넘길 시
            // NumberFormatException이 발생하고, 스택 트레이스를 그대로 노출시켜 내부 서버 구조 파악을 가능하게 함
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String stackTrace = sw.toString();
            
            return ApiResponse.error("500", "Internal Server Error:\n" + stackTrace);
        }
    }
}
