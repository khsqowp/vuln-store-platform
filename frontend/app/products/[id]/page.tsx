"use client";

import { useEffect, useState, use } from "react";
import apiClient from "@/lib/api/client";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get(`/v1/products/${productId}`);
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          // 취약점 48: /api/v1/products/null 로 접근 시 스택 트레이스 노출
          setErrorMsg(res.data.message);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setErrorMsg(error.response?.data?.message || "상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [productId]);

  if (loading) return <div className="text-center py-32 tracking-widest text-gray-400">LOADING...</div>;

  if (errorMsg) {
    return (
      <div className="container-main py-20">
        <div className="p-8 border-2 border-black bg-white shadow-xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-red-600 mb-4">ERROR DETECTED</h2>
          <div className="bg-gray-900 text-green-400 p-6 overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {errorMsg}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container-main py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 상품 이미지 */}
        <div className="bg-gray-100 aspect-[3/4] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={(product.imageUrl as string) || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            alt={product.name as string} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{product.category as string}</span>
          <h1 className="text-3xl font-black text-gray-900 mb-4">{product.name as string}</h1>
          <div className="text-3xl font-bold mb-8">{(product.price as number).toLocaleString()}원</div>
          
          <div className="border-t border-gray-200 pt-6 mb-8">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {(product.description as string) || "상세 설명이 없습니다."}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <button className="w-full h-14 border-2 border-black text-black font-bold text-lg hover:bg-gray-50 transition-colors">
              장바구니 담기
            </button>
            <button className="w-full h-14 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors">
              바로 구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
