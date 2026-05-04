"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 취약점 22: 클라이언트에서만 role 체크를 하고 있어서, 실제 API는 모든 인증 사용자가 접근 가능
    // role 체크를 클라이언트에서만 하는 것은 보안 제어가 아님
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        // 취약점 22 (관리자 접근 통제 미흡): ROLE_USER 토큰으로도 이 API 호출 성공
        const res = await apiClient.get("/v1/admin/users");
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, router]);

  const handleDelete = async (userId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await apiClient.delete(`/v1/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert("삭제 실패");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">LOADING...</div>;

  return (
    <div className="container-main py-12">
      <h2 className="text-3xl font-black mb-2 border-b-2 border-black pb-4">ADMIN PANEL</h2>

      {/* 취약점 22 경고 표시 */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-600">
        ⚠️ <b>취약점 22 (관리자 접근 통제 미흡)</b>: 이 페이지의 API는 <code>/api/v1/admin/users</code>이며, Spring Security에서 ROLE_ADMIN 권한 검증 없이 모든 인증 사용자가 접근 가능합니다.
        일반 사용자 토큰으로 <code>GET /api/v1/admin/users</code>를 호출해보세요.
      </div>

      <div className="mb-2 text-sm text-gray-500 font-bold">로그인 사용자 역할: {user?.role}</div>

      <div className="border-t-2 border-black mt-6">
        <div className="grid grid-cols-12 bg-gray-50 py-4 text-center font-bold text-sm text-gray-600 border-b border-gray-200">
          <div className="col-span-1">ID</div>
          <div className="col-span-4 text-left pl-4">이름</div>
          <div className="col-span-4 text-left">이메일</div>
          <div className="col-span-2">역할</div>
          <div className="col-span-1">삭제</div>
        </div>

        {users.map((u) => (
          <div key={u.id} className="grid grid-cols-12 py-4 text-center text-sm border-b border-gray-100 hover:bg-gray-50">
            <div className="col-span-1">{u.id}</div>
            <div className="col-span-4 text-left pl-4 font-medium">{u.name}</div>
            <div className="col-span-4 text-left text-gray-600">{u.email}</div>
            <div className="col-span-2">
              <span className={`px-2 py-1 text-xs font-bold ${u.role === "ROLE_ADMIN" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                {u.role}
              </span>
            </div>
            <div className="col-span-1">
              <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 font-bold text-xs">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
