"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth";

interface OrderData {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function MyOrdersPage() {
  const { isLoggedIn, user, updateUser } = useAuthStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchOrders = async () => {
      try {
        const res = await apiClient.get("/v1/orders");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  const handleRefund = async (orderId: number) => {
    try {
      const res = await apiClient.post(`/v1/orders/${orderId}/refund`);
      if (res.data.success) {
        alert("환불이 처리되었습니다. 마일리지가 적립되었습니다.");
        // 취약점 43 (재전송 공격 확인용): 환불 요청 성공 시 상태 새로고침 없이 마일리지만 프론트에서 임시 증가시킴.
        const refundedAmount = orders.find(o => o.id === orderId)?.totalAmount || 0;
        updateUser({ mileage: (user?.mileage || 0) + refundedAmount });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "환불 실패");
    }
  };

  if (loading) return <div className="text-center py-20">LOADING...</div>;

  return (
    <div className="container-main py-12">
      <h2 className="text-2xl font-black mb-8 border-b border-black pb-4">주문 내역</h2>

      {/* 디버깅 표시: 취약점 43 */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-600">
        ⚠️ <b>취약점 43 (재전송 공격)</b>: [환불/취소] 버튼을 여러 번 누르거나 패킷을 재전송하면 상태 확인 로직이 없어 마일리지가 중복으로 적립됩니다.
        <br/>
        ⚠️ <b>취약점 2 (IDOR)</b>: 이 화면에서는 내 주문만 보이지만, 브라우저 주소창이나 API 호출로 <code>/api/v1/orders/1</code> 등 다른 번호를 요청하면 무단으로 열람 가능합니다.
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border border-gray-200">주문 내역이 없습니다.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="text-sm text-gray-500 mb-1">{new Date(order.createdAt).toLocaleString()}</div>
                <div className="font-bold text-lg mb-2">주문번호: {order.id}</div>
                <div className="text-red-600 font-bold">{order.totalAmount.toLocaleString()}원</div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <span className={`px-3 py-1 text-sm font-bold ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {order.status === 'CANCELLED' ? '취소완료' : '결제완료'}
                </span>
                
                <button 
                  onClick={() => handleRefund(order.id)}
                  className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800"
                >
                  환불/취소 (마일리지 적립)
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
