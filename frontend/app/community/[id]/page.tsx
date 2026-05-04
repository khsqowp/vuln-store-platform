"use client";

import { useEffect, useState, use } from "react";
import apiClient from "@/lib/api/client";
import Link from "next/link";

interface PostDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorDetails?: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
  };
}

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiClient.get(`/v1/community/posts/${postId}`);
        if (res.data.success) {
          setPost(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div className="text-center py-32 tracking-widest text-gray-400">LOADING...</div>;
  if (!post) return <div className="text-center py-32 text-gray-500">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="container-main py-12">
      <div className="border-t-2 border-black border-b border-gray-200 py-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex gap-4">
            <span className="font-bold text-gray-900">{post.authorDetails?.name || "익명"}</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div>조회 0</div>
        </div>
      </div>

      {/* 취약점 4 (Stored XSS): 사용자가 작성한 HTML을 필터링 없이 그대로 렌더링 */}
      <div className="min-h-[300px] text-gray-800 leading-relaxed break-all py-4">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* 취약점 46 확인용 디버깅 박스 (실제 서비스라면 브라우저 개발자 도구의 Network 탭에서만 보이지만, 랩 환경이므로 화면에 시각화) */}
      <div className="mt-16 p-4 bg-red-50 border border-red-200">
        <h3 className="text-red-600 font-bold mb-2 text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          [취약점 46] API 응답 디버깅 (개발자용)
        </h3>
        <p className="text-xs text-red-500 mb-2">
          API 응답 객체(DTO)를 통해 작성자의 민감정보(비밀번호 해시, 전화번호 등)가 필터링 없이 과도하게 직렬화되어 클라이언트로 전송되고 있습니다.
        </p>
        <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto font-mono">
          {JSON.stringify(post.authorDetails, null, 2)}
        </pre>
      </div>

      <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
        <Link href="/community" className="px-6 py-2 border border-gray-300 text-sm font-bold hover:bg-gray-50">
          목록보기
        </Link>
      </div>
    </div>
  );
}
