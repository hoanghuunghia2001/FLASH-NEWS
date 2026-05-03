/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'; // Bắt buộc phải có để dùng usePathname

import Link from "next/link";
import { usePathname } from "next/navigation"; // Thêm dòng này
import { LayoutDashboard, FileText, BarChart3, Settings, Rss, DollarSign } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 z-50 hidden lg:block">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/40">N</div>
          <span className="text-xl font-black tracking-tighter dark:text-white uppercase">Nghia Pro</span>
        </div>

        <nav className="space-y-1">
          {/* Kiểm tra active dựa trên pathname */}
          <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Tổng quan" active={pathname === "/admin"} />
          <NavItem href="/admin/posts" icon={<FileText size={18} />} label="Bài viết" active={pathname.startsWith("/admin/posts")} />
          <NavItem href="/admin/analytics" icon={<BarChart3 size={18} />} label="Thống kê" active={pathname.startsWith("/admin/analytics")} />
          <NavItem href="/admin/crawl" icon={<Rss size={18} />} label="Cào tin tự động" active={pathname.startsWith("/admin/crawl")} />
          
          {/* Thêm Menu Quảng cáo Nghĩa vừa yêu cầu */}
          <NavItem href="/admin/ads" icon={<DollarSign size={18} />} label="Quảng cáo" active={pathname.startsWith("/admin/ads")} />
          
          <div className="pt-10 pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-4">Cài đặt</div>
          <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Hệ thống" active={pathname === "/admin/settings"} />
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 italic">Quản trị hệ thống v1.0</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold dark:text-white">Hoàng Nghĩa</p>
              <p className="text-[10px] text-zinc-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full border border-zinc-300 dark:border-zinc-700 overflow-hidden">
               {/* Nghĩa có thể thêm ảnh avatar vào đây */}
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
        active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1" 
        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
      }`}
    >
      <span className={`${active ? "scale-110" : "scale-100"} transition-transform`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}