"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import Link from "next/link";

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login?redirect=/cart");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await apiClient.get("/v1/cart");
        if (res.data.success) {
          setCartItems(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn, router]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      // 취약점 39 (가격 위변조): 클라이언트가 계산한 totalAmount와 개별 price를 그대로 서버에 보냄
      // 공격자는 이 요청을 가로채서 totalAmount를 1로, 각 item의 price를 1로 조작 가능.
      const payload = {
        totalAmount: totalAmount,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await apiClient.post("/v1/orders", payload);
      if (res.data.success) {
        alert("결제가 완료되었습니다.");
        router.push(`/order/success?orderId=${res.data.data.id}`);
      }
    } catch (err) {
      alert("결제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-32 text-gray-400 tracking-widest">LOADING...</div>;

  return (
    <div className="container-main py-12">
      <h2 className="text-3xl font-black mb-8 border-b-2 border-black pb-4 uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        SHOPPING CART
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-32 border-b border-gray-200">
          <p className="text-lg font-bold text-gray-500 mb-4">장바구니가 비어 있습니다.</p>
          <Link href="/products" className="inline-block px-8 py-3 bg-black text-white font-bold hover:bg-gray-800">
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="border-t-2 border-black">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 border-b border-gray-200">
                  <div className="w-24 h-32 bg-gray-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <Link href={`/products/${item.productId}`} className="font-bold text-lg hover:underline mb-2">
                      {item.productName}
                    </Link>
                    <div className="text-gray-500 text-sm mb-4">수량: {item.quantity}개</div>
                    <div className="font-bold text-lg">{(item.price * item.quantity).toLocaleString()}원</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 border border-gray-200 sticky top-24">
              <h3 className="font-bold text-lg mb-6">결제 정보</h3>
              
              <div className="flex justify-between mb-4 text-gray-600">
                <span>총 상품금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>배송비</span>
                <span>0원</span>
              </div>
              <div className="flex justify-between mt-6 pt-6 border-t border-gray-300 font-bold text-xl">
                <span>총 결제금액</span>
                <span className="text-red-600">{totalAmount.toLocaleString()}원</span>
              </div>

              {/* 디버깅 표시: 취약점 39 */}
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-xs text-red-600">
                ⚠️ <b>취약점 39(가격 조작)</b>: 프론트에서 전송하는 위 결제금액을 서버가 그대로 신뢰합니다. Burp Suite로 `totalAmount` 파라미터를 조작해보세요.
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full mt-6 bg-black text-white font-bold py-4 text-lg hover:bg-gray-800 transition-colors"
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
