"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoggedIn, updateUser } = useAuthStore();
  const [newEmail, setNewEmail] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/mypage");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) return null;

  const handleUpdateEmail = async () => {
    // 취약점 6 (CSRF): 아무런 검증 절차 없이 POST 요청 전송
    try {
      const res = await apiClient.post("/v1/users/me/email", { newEmail });
      if (res.data.success) {
        alert("이메일이 변경되었습니다.");
        updateUser({ email: newEmail });
        setNewEmail("");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "이메일 변경 실패");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 취약점 26 (악성코드 업로드): 프론트에서도 확장자만 막고 매직 넘버 검증은 안 함
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        alert("이미지 파일만 업로드 가능합니다. (우회 가능)");
        // return; (실제로는 프론트 검증도 쉽게 우회되므로 백엔드 검증 부재가 핵심)
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/v1/users/me/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        alert("프로필 사진이 변경되었습니다.");
        updateUser({ profileImageUrl: res.data.data.profileImageUrl });
      }
    } catch {
      alert("프로필 사진 변경 실패");
    }
  };

  return (
    <div className="container-main py-12">
      <h2 className="text-3xl font-black mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MY PAGE</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 사이드바 */}
        <div className="col-span-1 border border-gray-200 p-6 bg-white">
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {user.profileImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.profileImageUrl} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">사진</div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload} 
              accept="image/*"
            />
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-2 inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded">
              {user.role}
            </span>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <ul className="space-y-3 text-sm">
              <li className="font-bold text-black cursor-pointer">회원 정보 수정</li>
              <li className="text-gray-500 hover:text-black cursor-pointer">주문 내역 조회</li>
              <li className="text-gray-500 hover:text-black cursor-pointer">작성한 리뷰</li>
            </ul>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="col-span-2 border border-gray-200 p-8 bg-white">
          <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">회원 정보 수정</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">이름</label>
              <input type="text" value={user.name} disabled className="w-full h-12 px-4 bg-gray-100 border border-gray-200 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">현재 이메일</label>
              <input type="text" value={user.email} disabled className="w-full h-12 px-4 bg-gray-100 border border-gray-200 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">새 이메일로 변경</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="새 이메일 주소" 
                  className="flex-1 h-12 px-4 border border-gray-300 focus:border-black focus:outline-none" 
                />
                <button onClick={handleUpdateEmail} className="px-6 bg-black text-white font-bold whitespace-nowrap hover:bg-gray-800">
                  변경하기
                </button>
              </div>
              <p className="text-xs text-red-500 mt-2">
                * [테스트용 CSRF 취약점 타겟]: 아무런 보안 절차 없이 변경이 즉시 이루어집니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
