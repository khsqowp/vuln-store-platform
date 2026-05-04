"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useCartStore } from "@/lib/store/cart";

const categories = [
  { label: "NEW", href: "/products?sort=newest" },
  { label: "BEST", href: "/products?sort=best" },
  { label: "아우터", href: "/products?category=outer" },
  { label: "상의", href: "/products?category=top" },
  { label: "하의", href: "/products?category=bottom" },
  { label: "신발", href: "/products?category=shoes" },
  { label: "가방", href: "/products?category=bag" },
  { label: "액세서리", href: "/products?category=accessory" },
  { label: "스포츠", href: "/products?category=sports" },
  { label: "세일", href: "/products?sort=sale", className: "text-red-600 font-bold" },
];

export default function GNB() {
  const router = useRouter();
  const { isLoggedIn, user, clearAuth } = useAuthStore();
  const cartCount = useCartStore((s) => s.getTotalCount());
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : "border-b border-gray-200"
      }`}
    >
      {/* 상단 배너 */}
      <div className="bg-black text-white text-center text-xs py-2 font-medium tracking-wider">
        5월 특가 세일 최대 70% OFF — 오늘만 무료배송
      </div>

      {/* 메인 헤더 */}
      <div className="container-main">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 로고 */}
          <Link
            href="/"
            className="text-3xl font-black tracking-tighter"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            VULSHOP
          </Link>

          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                ref={searchRef}
                id="gnb-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="브랜드, 상품, 카테고리 검색"
                className="w-full h-10 pl-4 pr-10 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-5 text-sm shrink-0">
            {isLoggedIn ? (
              <>
                <Link href="/mypage" className="hover:text-black text-gray-600 hidden sm:block">
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-black text-gray-600 hidden sm:block"
                >
                  로그아웃
                </button>
                {(user?.role === "ROLE_ADMIN" ||
                  user?.role === "ROLE_MANAGER" ||
                  user?.role === "ROLE_STAFF") && (
                  <Link href="/admin" className="text-red-600 font-bold hidden sm:block">
                    관리자
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-black text-gray-600">
                  로그인
                </Link>
                <Link href="/register" className="hover:text-black text-gray-600 hidden sm:block">
                  회원가입
                </Link>
              </>
            )}
            <Link href="/cart" className="relative" id="gnb-cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 카테고리 네비게이션 */}
      <div className="border-t border-gray-100">
        <div className="container-main">
          <nav className="flex items-center overflow-x-auto gap-8 h-11 text-sm font-medium whitespace-nowrap">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`hover:text-black pb-0.5 border-b-2 border-transparent hover:border-black transition-all shrink-0 text-gray-700 ${
                  cat.className || ""
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
