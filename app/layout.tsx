import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import prisma from "@/lib/prisma";
import AdDisplay from "@/components/ads/AdDisplay";

const inter = Inter({ subsets: ["latin"] });

// Cập nhật Metadata chuẩn SEO cho FlashNews
export const metadata: Metadata = {
  title: "FlashNews | Tin tức cập nhật chớp nhoáng 24/7",
  description: "Hệ thống tổng hợp tin tức tự động, mang đến thông tin nóng hổi nhất từ các nguồn uy tín.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Lấy danh mục để hiển thị trên menu
  const categories = await prisma.category.findMany({
    take: 7,
    orderBy: { name: 'asc' }
  });

  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} bg-[#fcfaf6] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased`}>

        {/* TOP BAR: Hiển thị thời gian thực và slogan */}
        <div className="hidden md:block border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-[11px] font-medium text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-red-600 font-bold uppercase tracking-widest">Hot</span>
              <span>
                {new Intl.DateTimeFormat('vi-VN', {
                  weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric'
                }).format(new Date())}
              </span>
            </div>
            <div className="flex gap-5">
              <Link href="/latest" className="hover:text-red-600 transition">Mới nhất</Link>
              <Link href="/trending" className="hover:text-red-600 transition">Xu hướng</Link>
            </div>
          </div>
        </div>

        {/* MAIN HEADER: Logo FlashNews & Navigation */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

            {/* Logo FlashNews thiết kế mới */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 text-white p-1 rounded-md transform group-hover:rotate-12 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <div className="text-2xl font-black tracking-tighter flex items-center">
                <span className="text-zinc-900 dark:text-white">FLASH</span>
                <span className="text-red-600">NEWS</span>
              </div>
            </Link>

            {/* Menu danh mục */}
            <nav className="hidden lg:flex items-center gap-7 text-[14px] font-bold uppercase tracking-tight">
              <Link href="/" className="hover:text-red-600 transition">Trang chủ</Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="hover:text-red-600 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Icons & Admin */}

          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4">
          {/* Component này sẽ đọc từ Database vị trí HEADER */}
          <AdDisplay location="HEADER" />
        </div>

        {/* VIEWPORT CONTENT */}
        <div className="min-h-[80vh]">
          {children}
        </div>

        {/* FOOTER FLASHNEWS */}
        <footer className="bg-white dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10 mt-20">
          <div className="max-w-7xl mx-auto px-6">

            {/* Top Section: Branding & Newsletter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
              <div className="lg:col-span-5">
                <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
                  <div className="bg-red-600 text-white p-1.5 rounded-sm transform group-hover:rotate-12 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-[900] tracking-tighter dark:text-white uppercase italic">Flash News</span>
                </Link>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-md">
                  Hệ thống tổng hợp tin tức thông minh bằng AI. Cập nhật dòng chảy thế giới liên tục 24/7 với độ chính xác và tốc độ vượt trội từ các nguồn uy tín nhất.
                </p>

                {/* Social Links - Sử dụng SVG để đảm bảo hiển thị luôn đẹp */}
                <div className="flex gap-3 mt-8">
                  {[
                    { id: 'fb', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', label: 'Facebook' },
                    { id: 'tw', icon: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', label: 'Twitter' },
                    { id: 'yt', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z M9.75 15.02V8.98L15.5 12l-5.75 3.02z', label: 'Youtube' }
                  ].map((item) => (
                    <a
                      key={item.id}
                      href="#"
                      aria-label={item.label}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-zinc-50 dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-lg font-bold mb-2 dark:text-white">Đăng ký bản tin tiêu điểm</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Nhận tóm tắt tin tức quan trọng nhất gửi thẳng vào hòm thư của bạn mỗi sáng.</p>
                  <form className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Email của bạn..."
                      required
                      className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white transition-all shadow-sm"
                    />
                    <button type="submit" className="px-8 py-3 bg-zinc-900 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
                      Đăng ký ngay
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800 mb-12" />

            {/* Middle Section: Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
              <div>
                <h4 className="text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-6">Chuyên mục</h4>
                <ul className="space-y-4">
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <Link href={`/categories/${cat.slug}`} className="text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors text-[14px] font-medium">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-zinc-900 dark:text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
                  Về chúng tôi
                </h4>
                <ul className="space-y-5">
                  {[
                    { name: 'Giới thiệu', href: '/about' },
                    { name: 'Đội ngũ', href: '/team' },
                    { name: 'Tuyển dụng', href: '/careers' },
                    { name: 'Quảng cáo', href: '/ads' },
                    { name: 'Liên hệ tòa soạn', href: '/contact' }
                  ].map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex items-center text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all text-sm font-bold"
                      >
                        {/* Thanh gạch nhỏ xuất hiện khi hover */}
                        <span className="w-0 h-[1.5px] bg-orange-500 mr-0 group-hover:w-4 group-hover:mr-3 transition-all duration-300"></span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-zinc-900 dark:text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
                  Pháp lý
                </h4>
                <ul className="space-y-5">
                  {[
                    { name: 'Điều khoản dịch vụ', href: '/terms' },
                    { name: 'Chính sách bảo mật', href: '/privacy' },
                    { name: 'Chính sách Cookie', href: '/cookie' },
                    { name: 'Khiếu nại bản quyền', href: '/copyright' },
                  ].map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-zinc-500 dark:text-zinc-400 hover:text-red-500 transition-colors text-sm font-bold block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-6">Tải ứng dụng</h4>
                <p className="text-zinc-400 text-xs mb-4">Trải nghiệm đọc tin tốt nhất trên di động</p>
                <div className="space-y-3">
                  <div className="h-12 w-40 bg-zinc-900 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-white text-[13px] font-bold cursor-pointer hover:bg-zinc-800 transition-all border border-zinc-700 gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.3 17.15 4.13 10.9 7.42 10.43c1.07-.12 1.8.44 2.45.45.68.01 1.63-.58 2.87-.48 1.5.12 2.6.66 3.25 1.57-3.13 1.83-2.58 5.76.51 7.31zm-3.61-11.23c-.1-.1-.13-.2-.11-.3.26-1.33 1.54-2.3 2.82-2.28.1.01.19.11.2.22.05.35-.03.74-.23 1.1-.47.88-1.57 1.4-2.68 1.26z" /></svg>
                    App Store
                  </div>
                  <div className="h-12 w-40 bg-zinc-900 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-white text-[13px] font-bold cursor-pointer hover:bg-zinc-800 transition-all border border-zinc-700 gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5,3.22V20.78c0,0.44,0.25,0.73,0.61,0.8L15.63,12L5.61,2.42C5.25,2.49,5,2.78,5,3.22z M16.32,12.71l2.42-1.44 c0.54-0.32,0.54-0.85,0-1.17l-2.42-1.44L14.07,12L16.32,12.71z M15.54,7.31L6.72,2.06c-0.36-0.21-0.78-0.12-1,0.21L15.54,7.31z M15.54,16.69l-9.82,5.04c0.22,0.33,0.64,0.42,1,0.21l8.82-5.25L15.54,16.69z" /></svg>
                    Google Play
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Copyright */}
            <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-zinc-500 dark:text-zinc-500 text-[13px]">
                © {new Date().getFullYear()} <span className="font-bold text-zinc-900 dark:text-zinc-300">FLASHNEWS MEDIA</span>. Phát triển bởi đội ngũ kỹ thuật FlashNews.
              </div>
              <div className="flex items-center gap-6 text-[12px] font-bold text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-full border border-green-100 dark:border-green-500/20">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live System
                </div>
                <div className="hidden md:flex gap-4">
                  <button className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Vietnamese</button>
                  <span className="text-zinc-200 dark:text-zinc-800 font-light">|</span>
                  <button className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">English</button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}