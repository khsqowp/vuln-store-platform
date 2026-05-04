"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container-main py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-black mb-4">주문이 완료되었습니다!</h2>
      <p className="text-gray-500 mb-8">
        주문번호: <span className="font-bold text-black">{orderId}</span>
      </p>

      <div className="flex justify-center gap-4">
        <Link href={`/mypage/orders`} className="px-8 py-3 border-2 border-black font-bold hover:bg-gray-50 transition-colors">
          주문 내역 보기
        </Link>
        <Link href="/" className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors">
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
