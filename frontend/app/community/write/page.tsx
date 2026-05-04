"use client";

import { useState } from "react";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function CommunityWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  // 취약점 4 (Stored XSS): 에디터(여기서는 TextArea)에서 작성된 HTML 코드를 그대로 받음
  const [content, setContent] = useState("<p>내용을 입력하세요...</p>\n<!-- 악성 스크립트 테스트: <img src=\"x\" onerror=\"alert('XSS!')\" /> -->");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post("/v1/community/posts", {
        title,
        content
      });

      if (res.data.success) {
        alert("게시글이 등록되었습니다.");
        router.push(`/community/${res.data.data.id}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "게시글 작성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-12">
      <h2 className="text-2xl font-black mb-8 border-b-2 border-black pb-4">게시글 작성</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">제목</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            내용 (HTML Source Mode - 취약점 테스트용)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            실제 서비스의 Quill/CKEditor의 소스 모드를 에뮬레이션합니다. HTML 태그를 자유롭게 입력할 수 있습니다.
          </p>
          <textarea 
            className="w-full h-64 border border-gray-300 p-3 focus:border-black focus:outline-none font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 font-bold hover:bg-gray-50"
          >
            취소
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
