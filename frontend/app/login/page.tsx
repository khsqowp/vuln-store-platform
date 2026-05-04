"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth";
import Link from "next/link";
import { User } from "@/types";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiClient.post("/v1/auth/login", {
        email,
        password,
      }, {
        params: { redirect: redirectUrl }
      });

      if (res.data.success) {
        const { accessToken, user, redirectUrl: serverRedirect } = res.data.data as { accessToken: string; user: User; redirectUrl: string };
        setAuth(user, accessToken);
        
        // 취약점 21 (Redirect): 서버에서 받은 redirectUrl을 검증 없이 그대로 이동시킴
        // 악성 사이트(예: https://evil.com)로 오픈 리다이렉트가 가능함
        if (serverRedirect && serverRedirect.startsWith("http")) {
            window.location.href = serverRedirect;
        } else {
            router.push(serverRedirect || "/");
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>LOGIN</h1>
          <p className="text-gray-500 text-sm">VULSHOP에 오신 것을 환영합니다</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-100 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="이메일"
              className="w-full h-12 px-4 border border-gray-300 focus:border-black focus:outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full h-12 px-4 border border-gray-300 focus:border-black focus:outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-4 text-sm text-gray-600">
          <Link href="/register" className="hover:text-black hover:underline">회원가입</Link>
          <span className="text-gray-300">|</span>
          <Link href="/find-password" className="hover:text-black hover:underline">비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

