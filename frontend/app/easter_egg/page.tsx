"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface VulnInfo {
  id: number;
  domain: string;
  name: string;
  type: string;
  description: string;
  status: "IMPLEMENTED" | "PLANNED";
}

const vulnerabilities: VulnInfo[] = [
  { id: 24, domain: "User", name: "정규표현식 서비스 거부 (Regex DoS)", type: "WEB-24", description: "이메일 검증 시 백트래킹 유발 정규식 사용", status: "IMPLEMENTED" },
  { id: 30, domain: "User", name: "패스워드 정책 미흡", type: "WEB-30", description: "길이 및 복잡도 검증 없이 단순 패스워드 허용", status: "IMPLEMENTED" },
  { id: 31, domain: "User", name: "무작위 대입 공격 (Brute Force)", type: "WEB-31", description: "로그인 시도 횟수 제한 없음", status: "IMPLEMENTED" },
  { id: 32, domain: "User", name: "계정 정보 파악 (Enumeration)", type: "WEB-32", description: "이메일과 비밀번호 오류 메시지를 다르게 반환", status: "IMPLEMENTED" },
  { id: 21, domain: "User", name: "오픈 리다이렉트 (Open Redirect)", type: "WEB-21", description: "redirect 파라미터 검증 없이 이동", status: "IMPLEMENTED" },
  { id: 6, domain: "User", name: "CSRF 토큰 누락", type: "WEB-06", description: "정보 수정 시 CSRF 토큰 검증 부재", status: "IMPLEMENTED" },
  { id: 26, domain: "User", name: "악성 파일 업로드 (확장자 우회)", type: "WEB-26", description: "프로필 이미지 업로드 시 매직넘버 검증 부재", status: "IMPLEMENTED" },
  { id: 9, domain: "Product", name: "SQL Injection (Raw Query)", type: "WEB-09", description: "상품 정렬 시 raw query 사용 (OrderBy)", status: "IMPLEMENTED" },
  { id: 1, domain: "Product", name: "Reflected XSS (Query)", type: "WEB-01", description: "검색어 파라미터 화면 출력 시 이스케이프 누락", status: "IMPLEMENTED" },
  { id: 8, domain: "Product", name: "Reflected XSS (Path)", type: "WEB-08", description: "잘못된 경로 접근 시 경로 출력에 이스케이프 누락", status: "IMPLEMENTED" },
  { id: 48, domain: "Product", name: "오류 메시지 정보 노출", type: "WEB-48", description: "존재하지 않는 상품 ID 조회 시 스택트레이스 노출", status: "IMPLEMENTED" },
  { id: 4, domain: "Community", name: "Stored XSS", type: "WEB-04", description: "게시글 본문 HTML 필터링 없이 그대로 렌더링", status: "IMPLEMENTED" },
  { id: 46, domain: "Community", name: "민감정보 과도 노출", type: "WEB-46", description: "API 응답에 작성자의 비밀번호 등 전체 엔티티 노출", status: "IMPLEMENTED" },
  { id: 2, domain: "Order", name: "불충분한 인가 (IDOR)", type: "WEB-02", description: "주문 상세 조회 시 소유자 검증 로직 누락", status: "IMPLEMENTED" },
  { id: 39, domain: "Order", name: "가격 조작", type: "WEB-39", description: "결제 요청 시 클라이언트의 금액 정보를 검증 없이 신뢰", status: "IMPLEMENTED" },
  { id: 43, domain: "Order", name: "재전송 공격 (Replay)", type: "WEB-43", description: "환불 요청 시 상태 검증(멱등성) 없이 마일리지 무한 적립", status: "IMPLEMENTED" },
  { id: 7, domain: "Review", name: "Stored XSS", type: "WEB-07", description: "리뷰 본문에 스크립트 삽입 가능", status: "IMPLEMENTED" },
  { id: 26, domain: "Review", name: "파일 업로드 확장자 우회", type: "WEB-26", description: "리뷰 이미지 업로드 시 확장자만 느슨하게 체크", status: "IMPLEMENTED" },
  { id: 36, domain: "Coupon", name: "열거 공격 (Enumeration)", type: "WEB-36", description: "쿠폰 코드 검증 시 Rate Limit 없이 오류 메시지 구분", status: "IMPLEMENTED" },
  { id: 22, domain: "Admin", name: "관리자 접근 통제 미흡", type: "WEB-22", description: "관리자 API에 ROLE_ADMIN 권한 검증 누락", status: "IMPLEMENTED" },
  { id: 33, domain: "Seller", name: "입력값 검증 미흡", type: "WEB-33", description: "판매자 신청 시 사업자번호 형식 미검증", status: "IMPLEMENTED" },
  { id: 49, domain: "Event", name: "동시성 취약점 (Race Condition)", type: "WEB-49", description: "이벤트 참여 시 락(Lock) 없이 처리하여 초과 획득 가능", status: "IMPLEMENTED" },
];

export default function EasterEggPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container-main py-12">
      <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
        <div>
          <h1 className="text-4xl font-black text-red-600 mb-2 font-mono">⚠️ VULNERABILITY MAP</h1>
          <p className="text-gray-500 font-bold">VulShop 의도적 취약점 전체 목록 (Layer 2 진단 맵)</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black">{vulnerabilities.filter(v => v.status === "IMPLEMENTED").length}</div>
          <div className="text-sm font-bold text-gray-400">TOTAL IMPLEMENTED</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vulnerabilities.map((v, i) => (
          <div key={i} className="border-2 border-black p-6 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-red-600 text-white font-bold text-xs px-3 py-1">
              {v.type}
            </div>
            <div className="text-sm font-bold text-gray-400 mb-2 uppercase">{v.domain}</div>
            <h3 className="text-xl font-black mb-3 group-hover:text-red-600 transition-colors">{v.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{v.description}</p>
            
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
              <span className={`text-xs font-bold px-2 py-1 ${v.status === 'IMPLEMENTED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {v.status}
              </span>
              <span className="text-xs text-gray-400 font-mono">ID: {v.id}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-900 text-green-400 font-mono text-sm">
        <p className="mb-2">{">"} SYSTEM_INFO: ALL 22 VULNERABILITIES SUCCESSFULLY INJECTED.</p>
        <p className="mb-2">{">"} MISSION: IDENTIFY AND EXPLOIT THE ABOVE TARGETS USING BURP SUITE.</p>
        <p>{">"} GOOD LUCK, HACKER.</p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="inline-block border-2 border-black px-8 py-3 font-bold hover:bg-black hover:text-white transition-colors">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
