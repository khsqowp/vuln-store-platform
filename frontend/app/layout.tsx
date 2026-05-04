import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GNB from "@/components/layout/GNB";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "VULSHOP — 대한민국 패션 버티컬 쇼핑몰",
    template: "%s | VULSHOP",
  },
  description:
    "VULSHOP에서 오늘의 트렌드를 발견하세요. 국내외 수천 개 브랜드의 최신 패션 아이템을 한 곳에서.",
  keywords: ["패션", "쇼핑몰", "의류", "스트릿패션", "vulshop"],
  openGraph: {
    title: "VULSHOP — 대한민국 패션 버티컬 쇼핑몰",
    description: "오늘의 트렌드를 발견하세요",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          <GNB />
          <main className="min-h-screen bg-white">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
