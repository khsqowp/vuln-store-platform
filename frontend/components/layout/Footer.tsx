import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div
              className="text-2xl font-black tracking-tighter mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              VULSHOP
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              대한민국 1위 패션 버티컬 쇼핑몰<br />
              트렌드를 앞서가는 당신을 위해
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">쇼핑</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products?sort=newest" className="hover:text-white transition-colors">신상품</Link></li>
              <li><Link href="/products?sort=best" className="hover:text-white transition-colors">베스트</Link></li>
              <li><Link href="/event" className="hover:text-white transition-colors">기획전</Link></li>
              <li><Link href="/products?sort=sale" className="hover:text-white transition-colors">세일</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">고객지원</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cs/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link></li>
              <li><Link href="/cs/inquiry" className="hover:text-white transition-colors">1:1 문의</Link></li>
              <li><Link href="/cs/notice" className="hover:text-white transition-colors">공지사항</Link></li>
              <li><Link href="/seller/apply" className="hover:text-white transition-colors">입점 신청</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">회사 정보</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><span>사업자등록번호: 123-45-67890</span></li>
              <li><span>통신판매업: 제2024-서울강남-1234호</span></li>
            </ul>
          </div>
        </div>
        <div className="divider mt-8 mb-6" style={{ backgroundColor: "#333" }} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-500">
          <span>© 2024 VULSHOP Corp. All rights reserved.</span>
          <span>대표: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123 | 고객센터: 1588-0000</span>
        </div>
      </div>
    </footer>
  );
}
