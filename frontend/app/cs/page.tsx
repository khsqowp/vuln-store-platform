"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth";
import Link from "next/link";

interface InquiryData {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

export default function CsPage() {
  const { isLoggedIn } = useAuthStore();
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/v1/cs/inquiries");
        if (res.data.success) setInquiries(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isLoggedIn]);

  return (
    <div className="container-main py-12">
      <h2 className="text-2xl font-black mb-8 border-b-2 border-black pb-4">고객센터 / 1:1 문의</h2>

      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-600">
        ⚠️ <b>취약점 2 (IDOR)</b>: <code>/api/v1/cs/inquiries/[id]</code> 조회 시 본인 문의인지 검증하지 않아, URL의 id만 변경하면 타인의 1:1 문의 내용을 열람 가능합니다.
      </div>

      <div className="flex justify-end mb-6">
        <Link href="/cs/write" className="px-6 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800">
          문의 작성
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">LOADING...</div>
      ) : !isLoggedIn ? (
        <div className="text-center py-16 border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">로그인 후 문의 내역을 확인할 수 있습니다.</p>
          <Link href="/login" className="px-6 py-2 bg-black text-white font-bold text-sm">로그인</Link>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 text-gray-500">
          등록된 문의가 없습니다.
        </div>
      ) : (
        <div className="border-t-2 border-black">
          {inquiries.map((inq) => (
            <Link key={inq.id} href={`/cs/${inq.id}`}
              className="flex justify-between items-center py-5 border-b border-gray-200 hover:bg-gray-50 px-2">
              <div>
                <span className="font-medium">{inq.title}</span>
                <span className="ml-3 text-xs text-gray-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`px-3 py-1 text-xs font-bold ${inq.status === "ANSWERED" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                {inq.status === "ANSWERED" ? "답변완료" : "접수중"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
