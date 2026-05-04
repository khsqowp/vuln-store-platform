"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";

function ReviewWriteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // JSON으로 전송 (이미지 업로드는 multipart 방식으로 별도 처리 가능)
      const res = await apiClient.post("/v1/reviews", {
        productId: Number(productId),
        rating,
        // 취약점 7: XSS 페이로드를 그대로 전송 가능
        content,
        imageUrl: null,
      });

      if (res.data.success) {
        alert("리뷰가 등록되었습니다.");
        router.push(`/products/${productId}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "리뷰 작성 실패 (로그인이 필요합니다).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-2 border-b-2 border-black pb-4">리뷰 작성</h2>
      <p className="text-sm text-gray-500 mb-8">상품 ID: {productId}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">별점</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            리뷰 내용 (HTML 허용 — 취약점 7 테스트용)
          </label>
          <p className="text-xs text-red-500 mb-2">
            ⚠️ 취약점 7: 입력한 HTML이 서버에 그대로 저장되어 상품 상세 페이지에서 실행됩니다.
          </p>
          <textarea
            className="w-full h-40 border border-gray-300 p-3 focus:border-black focus:outline-none font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder={'예시: <img src="x" onerror="alert(document.cookie)" />'}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 font-bold hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "등록 중..." : "리뷰 등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ReviewWritePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <ReviewWriteForm />
    </Suspense>
  );
}
