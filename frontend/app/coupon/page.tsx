"use client";

import { useState } from "react";
import apiClient from "@/lib/api/client";

export default function CouponPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ name?: string; discountAmount?: number; message?: string } | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await apiClient.get(`/v1/coupons/validate?code=${encodeURIComponent(code)}`);
      if (res.data.success) {
        setIsValid(true);
        setResult(res.data.data);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setIsValid(false);
      // 취약점 36 (열거 공격): 서버에서 반환하는 에러 메시지가 상세해서 코드 존재 여부를 유추할 수 있음
      setResult({ message: error.response?.data?.message || "유효하지 않은 쿠폰 코드입니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-2 border-b-2 border-black pb-4">쿠폰 / 마일리지</h2>

      <div className="mb-8 p-4 bg-red-50 border border-red-200 text-sm text-red-600">
        ⚠️ <b>취약점 36 (열거 공격)</b>: 쿠폰 코드 검증 API는 Rate Limiting 없이 무한 시도가 가능하며, 에러 메시지가 코드 존재 여부를 구분하여 자동화 공격에 노출됩니다.
      </div>

      <form onSubmit={handleValidate} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold mb-2">쿠폰 코드 입력</label>
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 p-3 focus:border-black focus:outline-none font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="예: SALE-1234"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "확인중..." : "확인"}
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className={`p-6 border ${isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          {isValid ? (
            <>
              <p className="font-bold text-green-700 mb-2">✓ 유효한 쿠폰입니다!</p>
              <p className="text-sm text-gray-700">{result.name}</p>
              <p className="text-2xl font-black text-green-600 mt-2">
                {result.discountAmount?.toLocaleString()}원 할인
              </p>
            </>
          ) : (
            <p className="text-red-600 font-medium">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
