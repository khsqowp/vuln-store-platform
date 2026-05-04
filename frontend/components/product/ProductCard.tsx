"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export default function ProductCard({ id, name, price, imageUrl, category }: ProductProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 무신사 스타일: 심플한 흑백 대비, 여백, 마우스 호버 시 자연스러운 강조
  return (
    <div 
      className="group relative flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${id}`} className="block overflow-hidden bg-gray-100 aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
      </Link>
      
      <div className="mt-4 flex flex-col space-y-1">
        {category && (
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{category}</span>
        )}
        <Link href={`/products/${id}`} className="text-sm font-semibold text-gray-900 group-hover:underline line-clamp-2">
          {name}
        </Link>
        <span className="text-base font-black text-black">
          {price.toLocaleString()}원
        </span>
      </div>
      
      {/* 찜하기 버튼 (더미) */}
      <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
    </div>
  );
}
