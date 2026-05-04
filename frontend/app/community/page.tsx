"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";

interface PostData {
  id: number;
  title: string;
  createdAt: string;
  authorDetails?: {
    name: string;
  };
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiClient.get("/v1/community/posts");
        if (res.data.success) {
          setPosts(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container-main py-12">
      <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
        <h2 className="text-3xl font-black uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          COMMUNITY
        </h2>
        
        {isLoggedIn && (
          <Link href="/community/write" className="px-6 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors">
            글쓰기
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium tracking-widest">LOADING...</div>
      ) : (
        <div className="w-full border-t-2 border-black">
          <div className="grid grid-cols-12 bg-gray-50 py-4 text-center font-bold text-sm text-gray-600 border-b border-gray-200">
            <div className="col-span-1">NO</div>
            <div className="col-span-7 text-left pl-4">제목</div>
            <div className="col-span-2">작성자</div>
            <div className="col-span-2">등록일</div>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border-b border-gray-200">
              등록된 게시글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="grid grid-cols-12 py-5 text-center text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="col-span-1">{post.id}</div>
                <div className="col-span-7 text-left pl-4">
                  <Link href={`/community/${post.id}`} className="hover:underline font-medium block truncate">
                    {post.title}
                  </Link>
                </div>
                <div className="col-span-2">{post.authorDetails?.name || "익명"}</div>
                <div className="col-span-2 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
