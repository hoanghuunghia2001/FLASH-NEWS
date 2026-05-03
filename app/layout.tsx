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
              <Link href="/rss" className="hover:text-red-600 transition">RSS</Link>
            </div>
          </div>
        </div>

        {/* MAIN HEADER: Logo FlashNews & Navigation */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* Logo FlashNews thiết kế mới */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 text-white p-1 rounded-md transform group-hover:rotate-12 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
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
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              <Link 
                href="/admin" 
                className="hidden sm:flex bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-lg shadow-zinc-200 dark:shadow-none"
              >
                Admin
              </Link>
            </div>
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
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 pb-12 border-b border-zinc-100 dark:border-zinc-800">
              <div className="md:col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <div className="bg-red-600 text-white p-1 rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <span className="text-xl font-black tracking-tighter dark:text-white uppercase">Flash News</span>
                </Link>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                  FlashNews là nền tảng tin tức thông minh, tự động tổng hợp những tin tức quan trọng nhất trong ngày, giúp bạn nắm bắt thế giới chỉ trong vài phút.
                </p>
              </div>
              
              <div>
                <h4 className="font-black mb-5 text-[12px] uppercase tracking-widest text-zinc-400">Chuyên mục</h4>
                <ul className="space-y-3 text-[14px] font-medium text-zinc-600 dark:text-zinc-400">
                  {categories.slice(0, 5).map(cat => (
                    <li key={cat.id}>
                      <Link href={`/categories/${cat.slug}`} className="hover:text-red-600 transition">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black mb-5 text-[12px] uppercase tracking-widest text-zinc-400">Hỗ trợ</h4>
                <ul className="space-y-3 text-[14px] font-medium text-zinc-600 dark:text-zinc-400">
                  <li><Link href="/about" className="hover:text-red-600 transition">Về chúng tôi</Link></li>
                  <li><Link href="/contact" className="hover:text-red-600 transition">Liên hệ</Link></li>
                  <li><Link href="/privacy" className="hover:text-red-600 transition">Bảo mật</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-medium text-zinc-400 uppercase tracking-tight">
              <p>© {new Date().getFullYear()} FLASHNEWS MEDIA. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-6">
                <span className="dark:text-zinc-600">Phát triển bởi FLASHNEWS MEDIA</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}