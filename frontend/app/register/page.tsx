"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiClient.post("/v1/auth/register", formData);
      if (res.data.success) {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>JOIN US</h1>
          <p className="text-gray-500 text-sm">VULSHOP 회원가입</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-100 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">이메일 *</label>
            <input
              type="text"
              name="email"
              placeholder="예) vulshop@example.com"
              className="w-full h-12 px-4 border border-gray-300 focus:border-black focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">비밀번호 *</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 입력 (취약점 30: 1234 입력 가능)"
              className="w-full h-12 px-4 border border-gray-300 focus:border-black focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">이름 *</label>
            <input
              type="text"
              name="name"
              placeholder="이름 입력"
              className="w-full h-12 px-4 border border-gray-300 focus:border-black focus:outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">연락처 *</label>
            <input
              type="text"
              name="phone"
              placeholder="예) 010-1234-5678"
              className="w-full h-12 px-4 border border-gray-300 focus:border-black focus:outline-none"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-6"
          >
            {loading ? "처리중..." : "회원가입 하기"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요? <Link href="/login" className="text-black font-bold hover:underline">로그인</Link>
        </div>
      </div>
    </div>
  );
}
