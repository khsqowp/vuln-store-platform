"use client";

import { useEffect, useState, use } from "react";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

interface ProductData {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  description?: string;
}

interface ReviewData {
  id: number;
  authorName: string;
  rating: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get(`/v1/products/${productId}`);
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          setErrorMsg(res.data.message);
        }

        // 리뷰 조회
        const reviewRes = await apiClient.get(`/v1/reviews?productId=${productId}`);
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.data);
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
      {/* 상품 메인 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-gray-100 aspect-[3/4] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{product.category}</span>
          <h1 className="text-3xl font-black text-gray-900 mb-4">{product.name}</h1>
          <div className="text-3xl font-bold mb-8">{product.price.toLocaleString()}원</div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || "상세 설명이 없습니다."}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <button
              onClick={async () => {
                try {
                  const res = await apiClient.post("/v1/cart", { productId: product.id, quantity: 1 });
                  if (res.data.success) alert("장바구니에 담겼습니다.");
                } catch {
                  alert("장바구니 담기에 실패했습니다 (로그인이 필요할 수 있습니다).");
                }
              }}
              className="w-full h-14 border-2 border-black text-black font-bold text-lg hover:bg-gray-50 transition-colors"
            >
              장바구니 담기
            </button>
            <button className="w-full h-14 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors">
              바로 구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="border-t-2 border-black pt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black">REVIEWS ({reviews.length})</h2>
          <Link
            href={`/review/write?productId=${productId}`}
            className="px-6 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800"
          >
            리뷰 작성
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-dashed border-gray-300">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-bold text-sm">{review.authorName}</span>
                  <div className="flex text-yellow-400 text-sm">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                  <span className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                {/* 취약점 7 (Stored XSS): content를 dangerouslySetInnerHTML로 렌더링 */}
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />
                {review.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={review.imageUrl} alt="리뷰 이미지" className="mt-3 h-32 object-cover" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
