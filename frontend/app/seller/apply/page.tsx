"use client";

import { useState } from "react";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function SellerApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ brandName: "", businessNumber: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/v1/seller/apply", form);
      if (res.data.success) {
        alert("판매자 신청이 완료되었습니다. 심사 후 승인됩니다.");
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "신청에 실패했습니다 (로그인 필요).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-2 border-b-2 border-black pb-4">판매자 입점 신청</h2>
      <p className="text-sm text-gray-500 mb-8">수십만 명의 패션 피플에게 당신의 브랜드를 선보이세요.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">브랜드명</label>
          <input type="text" required className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none"
            value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">사업자등록번호</label>
          <input type="text" required placeholder="000-00-00000"
            className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none font-mono"
            value={form.businessNumber} onChange={(e) => setForm({ ...form, businessNumber: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">브랜드 소개</label>
          <textarea rows={4} className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-4 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400">
          {loading ? "신청 중..." : "입점 신청하기"}
        </button>
      </form>
    </div>
  );
}
