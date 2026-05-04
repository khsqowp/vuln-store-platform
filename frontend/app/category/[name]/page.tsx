"use client";

import { useEffect, useState, use } from "react";
import apiClient from "@/lib/api/client";
import ProductCard from "@/components/product/ProductCard";

interface ProductData {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export default function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  // Next.js 15: params is a Promise
  const resolvedParams = use(params);
  const categoryName = resolvedParams.name;
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await apiClient.get(`/v1/category/${categoryName}`);
        if (res.data.success) {
          setProducts(res.data.data);
        } else {
          setErrorMsg(res.data.message);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        // 취약점 8: Reflected XSS (Path Variable)
        // 백엔드에서 온 에러 메시지(categoryName 포함)를 그대로 상태에 저장
        setErrorMsg(error.response?.data?.message || "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="container-main py-12">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl font-black uppercase tracking-wider mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          {categoryName}
        </h2>
        <div className="w-12 h-1 bg-black"></div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium tracking-widest">LOADING...</div>
      ) : errorMsg ? (
        <div className="text-center py-20">
          <p className="text-xl font-bold mb-4">앗! 문제가 발생했습니다.</p>
          {/* 취약점 8 트리거: dangerouslySetInnerHTML을 사용하여 XSS 발생 */}
          <div 
            className="p-4 bg-red-50 border border-red-100 text-red-500 inline-block"
            dangerouslySetInnerHTML={{ __html: errorMsg }} 
          />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">해당 카테고리에 상품이 없습니다.</div>
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
