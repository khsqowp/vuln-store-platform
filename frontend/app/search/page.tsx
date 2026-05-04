"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/api/client";
import ProductCard from "@/components/product/ProductCard";

interface ProductData {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

function SearchResult() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await apiClient.get(`/v1/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setProducts(res.data.data.results);
          // 취약점 1: 백엔드에서 반환한 이스케이프 되지 않은 검색어
          setSearchKeyword(res.data.data.searchKeyword); 
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div className="container-main py-12">
      <div className="mb-12 border-b border-black pb-6">
        <h2 className="text-2xl font-black">
          {/* 취약점 1 트리거: dangerouslySetInnerHTML 사용 */}
          <span dangerouslySetInnerHTML={{ __html: `'${searchKeyword || query}'` }} className="text-blue-600" />
          <span className="ml-2">검색 결과</span>
        </h2>
        <p className="mt-2 text-gray-500 font-medium">총 {products.length}개의 상품이 검색되었습니다.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium tracking-widest">LOADING...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-32 bg-gray-50">
          <p className="text-lg font-bold text-gray-600 mb-2">검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-400">다른 검색어로 다시 시도해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id} 
              name={product.name} 
              price={product.price} 
              imageUrl={product.imageUrl}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SearchResult />
    </Suspense>
  );
}
