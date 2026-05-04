"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/api/client";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

interface ProductData {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

function ProductList() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "created_at DESC";
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get(`/v1/products?sort=${sort}`);
        if (res.data.success) {
          setProducts(res.data.data);
          setErrorMsg(null);
        } else {
          setErrorMsg(res.data.message);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        // 취약점 9: SQLi 로 인해 500 에러 발생 시 에러 메시지 렌더링
        setErrorMsg(error.response?.data?.message || "상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sort]);

  return (
    <div className="container-main py-12">
      <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
        <h2 className="text-3xl font-black uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          ALL PRODUCTS
        </h2>
        
        {/* 정렬 옵션 (취약점 9: SQLi 진입점) */}
        <div className="flex gap-4 text-sm font-bold">
          <Link href="/products?sort=created_at DESC" className={sort.includes("created_at") ? "text-black" : "text-gray-400 hover:text-black"}>신상품순</Link>
          <span className="text-gray-300">|</span>
          <Link href="/products?sort=price ASC" className={sort.includes("price ASC") ? "text-black" : "text-gray-400 hover:text-black"}>낮은가격순</Link>
          <span className="text-gray-300">|</span>
          <Link href="/products?sort=price DESC" className={sort.includes("price DESC") ? "text-black" : "text-gray-400 hover:text-black"}>높은가격순</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium tracking-widest">LOADING...</div>
      ) : errorMsg ? (
        <div className="text-center py-20">
          <p className="text-xl font-bold mb-4 text-red-600">서버 에러가 발생했습니다.</p>
          <div className="p-4 bg-gray-900 text-green-400 text-left font-mono text-sm overflow-x-auto whitespace-pre-wrap max-w-4xl mx-auto rounded shadow-lg">
            {errorMsg}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">상품이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id} 
              name={product.name} 
              price={product.price} 
              imageUrl={product.imageUrl}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <ProductList />
    </Suspense>
  );
}
