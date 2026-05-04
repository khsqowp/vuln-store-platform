import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VULSHOP — 대한민국 패션 버티컬 쇼핑몰",
  description: "오늘의 트렌드를 발견하세요. 국내외 수천 개 브랜드의 최신 패션 아이템.",
};

const heroBanners = [
  {
    id: 1,
    title: "2024 SS\nNEW ARRIVAL",
    subtitle: "봄·여름 신상품 컬렉션 출시",
    href: "/products?sort=newest",
    bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
    accent: "text-red-500",
  },
  {
    id: 2,
    title: "SEASON\nSALE",
    subtitle: "최대 70% 할인 — 오늘 자정 마감",
    href: "/products?sort=sale",
    bg: "bg-gradient-to-br from-red-900 via-red-800 to-black",
    accent: "text-yellow-400",
  },
];

const rankingProducts = [
  { rank: 1, name: "오버사이즈 헤비 워싱 티셔츠", brand: "COVERNAT", price: 89000, discounted: 62300, rate: 30, img: "/images/products/top1.jpg" },
  { rank: 2, name: "와이드 데님 팬츠 (인디고)", brand: "POLO RALPH LAUREN", price: 198000, discounted: 138600, rate: 30, img: "/images/products/bottom1.jpg" },
  { rank: 3, name: "나일론 집업 아우터", brand: "DESCENTE ALLTERRAIN", price: 650000, discounted: 455000, rate: 30, img: "/images/products/outer1.jpg" },
  { rank: 4, name: "척테일러 캔버스 하이탑", brand: "CONVERSE", price: 89000, discounted: 71200, rate: 20, img: "/images/products/shoes1.jpg" },
  { rank: 5, name: "레더 미니 크로스백", brand: "MARHEN.J", price: 129000, discounted: 103200, rate: 20, img: "/images/products/bag1.jpg" },
  { rank: 6, name: "코튼 스트라이프 셔츠", brand: "POTTERY", price: 148000, discounted: 118400, rate: 20, img: "/images/products/shirt1.jpg" },
  { rank: 7, name: "우모 다운 패딩 롱코트", brand: "MONCLER", price: 1290000, discounted: 903000, rate: 30, img: "/images/products/outer2.jpg" },
  { rank: 8, name: "에어맥스 97 스니커즈", brand: "NIKE", price: 169000, discounted: 135200, rate: 20, img: "/images/products/shoes2.jpg" },
];

const newProducts = [
  { id: 9, name: "리넨 블렌드 크루넥 니트", brand: "COS", price: 89000, img: "/images/products/knit1.jpg" },
  { id: 10, name: "집업 트랙 재킷 세트", brand: "ADER ERROR", price: 298000, img: "/images/products/jacket1.jpg" },
  { id: 11, name: "와이드 코튼 슬랙스", brand: "THEORY", price: 198000, img: "/images/products/slacks1.jpg" },
  { id: 12, name: "버킷 햇 (베이지)", brand: "STUSSY", price: 58000, img: "/images/products/hat1.jpg" },
];

const brands = [
  "COVERNAT", "POLO RALPH LAUREN", "ADIDAS", "NIKE", "ADER ERROR",
  "STUSSY", "MONCLER", "STONE ISLAND", "OFF-WHITE", "ACNE STUDIOS",
];

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function HomePage() {
  return (
    <div>
      {/* 히어로 배너 */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-96 md:h-[520px]">
        {heroBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className={`relative flex flex-col justify-end p-10 group overflow-hidden ${banner.bg}`}
          >
            <div className="relative z-10">
              <p className={`text-xs font-bold tracking-[0.3em] mb-3 ${banner.accent}`}>
                {banner.subtitle}
              </p>
              <h2
                className="text-white text-5xl md:text-6xl font-black leading-none whitespace-pre-line"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {banner.title}
              </h2>
              <span className="inline-block mt-6 text-white text-sm border-b border-white pb-0.5 group-hover:border-opacity-70 transition-all">
                지금 쇼핑하기 →
              </span>
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>
        ))}
      </section>

      {/* 브랜드 띠 */}
      <section className="bg-black text-white overflow-hidden py-4">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="text-sm font-bold tracking-widest shrink-0">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* 랭킹 섹션 */}
      <section className="container-main py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">RANKING</h2>
            <p className="section-subtitle">실시간 인기 상품 TOP 8</p>
          </div>
          <Link href="/products?sort=best" className="text-sm text-gray-500 hover:text-black border-b border-gray-300">
            전체보기
          </Link>
        </div>
        <div className="product-grid">
          {rankingProducts.map((product) => (
            <Link
              key={product.rank}
              href={`/products/${product.rank}`}
              id={`ranking-product-${product.rank}`}
              className="group block"
            >
              <div className="relative bg-gray-100 aspect-[3/4] mb-3 overflow-hidden">
                <div className="absolute top-2 left-2 z-10 bg-black text-white text-xs font-bold w-6 h-6 flex items-center justify-center">
                  {product.rank}
                </div>
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">{product.brand}</p>
              <p className="text-sm font-medium text-gray-900 truncate mb-1">{product.name}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-red-600 font-bold text-sm">{product.rate}%</span>
                <span className="font-bold text-sm">{formatPrice(product.discounted)}원</span>
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 배너 CTA */}
      <section className="bg-black text-white py-20 text-center">
        <p className="text-xs tracking-[0.5em] text-gray-400 mb-4">VULSHOP SELLERS</p>
        <h2
          className="text-5xl md:text-7xl font-black mb-6 text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          판매자가 되세요
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          수십만 명의 패션 피플에게 당신의 브랜드를 알리세요
        </p>
        <Link href="/seller/apply" className="btn-point inline-block px-10 py-4 text-base">
          입점 신청하기
        </Link>
      </section>

      {/* 신상품 섹션 */}
      <section className="container-main py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">NEW ARRIVAL</h2>
            <p className="section-subtitle">방금 막 들어온 신상품</p>
          </div>
          <Link href="/products?sort=newest" className="text-sm text-gray-500 hover:text-black border-b border-gray-300">
            전체보기
          </Link>
        </div>
        <div className="product-grid">
          {newProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              id={`new-product-${product.id}`}
              className="group block"
            >
              <div className="relative bg-gray-100 aspect-[3/4] mb-3 overflow-hidden">
                <span className="badge-new absolute top-2 left-2 z-10">NEW</span>
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">{product.brand}</p>
              <p className="text-sm font-medium text-gray-900 truncate mb-1">{product.name}</p>
              <span className="font-bold text-sm">{formatPrice(product.price)}원</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
