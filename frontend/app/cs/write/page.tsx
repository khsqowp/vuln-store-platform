"use client";

import { useState } from "react";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function CsWritePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/v1/cs/inquiries", form);
      if (res.data.success) {
        alert("문의가 접수되었습니다.");
        router.push("/cs");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "문의 접수 실패 (로그인 필요).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-8 border-b-2 border-black pb-4">1:1 문의 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">제목</label>
          <input type="text" required className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">내용</label>
          <textarea rows={6} required className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none"
            value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-8 py-3 border border-gray-300 font-bold">취소</button>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400">
            {loading ? "접수 중..." : "문의 접수"}
          </button>
        </div>
      </form>
    </div>
  );
}
