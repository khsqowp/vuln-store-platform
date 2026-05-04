"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useCartStore } from "@/lib/store/cart";

const categories = [
  { label: "NEW", href: "/products?sort=newest" },
  { label: "BEST", href: "/products?sort=best" },
  { label: "아우터", href: "/category/outer" },
  { label: "상의", href: "/category/top" },
  { label: "하의", href: "/category/bottom" },
  { label: "신발", href: "/category/shoes" },
  { label: "가방", href: "/category/bag" },
  { label: "COMMUNITY", href: "/community", className: "font-bold text-blue-600" },
  { label: "EVENT", href: "/event", className: "font-bold text-purple-600" },
  { label: "고객센터", href: "/cs" },
  { label: "판매자신청", href: "/seller/apply" },
  { label: "쿠폰", href: "/coupon" },
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

  // 장바구니 개수 연동을 위한 간단한 처리 (실제로는 fetchCart 활용이 좋음)
  useEffect(() => {
    if (isLoggedIn) {
      import("@/lib/api/client").then(module => {
        module.default.get("/v1/cart").then(res => {
          if (res.data.success) {
            // 이 프로젝트에서는 DB 카운트를 바로 뱃지로 쓸 수 있게, 여기서는 단순히 length 사용
            // 전역 스토어를 굳이 복잡하게 안하고 로컬 상태로 해도 됨 (여기선 편의상 생략, Zustand 사용)
          }
        });
      });
    }
  }, [isLoggedIn]);

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
                <div className="hidden lg:flex items-center gap-4 border-r border-gray-300 pr-4 mr-1">
                  <span className="text-gray-600 font-medium">마일리지:</span>
                  <span className="font-bold text-red-600">{user?.mileage?.toLocaleString() || 0}M</span>
                </div>
                <Link href="/mypage" className="hover:text-black text-gray-600 hidden sm:block">
                  {user?.name}
                </Link>
                <Link href="/mypage/orders" className="hover:text-black text-gray-600 hidden sm:block">
                  주문내역
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
