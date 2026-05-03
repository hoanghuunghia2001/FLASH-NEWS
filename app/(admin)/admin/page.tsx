/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import CrawlButton from "@/components/admin/CrawlButton";
import { FileText, Eye, MousePointer2, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  // 1. Fetch dữ liệu thống kê thực tế từ DB
  const [totalPosts, totalViews, autoPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
    prisma.post.count({ where: { isAuto: true } })
  ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { category: true }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight dark:text-white">Chào Nghĩa! ⚡</h1>
          <p className="text-zinc-500 mt-1">Đây là những gì đang diễn ra với Blog của bạn hôm nay.</p>
        </div>
        <CrawlButton />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng bài viết" value={totalPosts} icon={<FileText size={20}/>} color="blue" />
        <StatCard title="Tổng lượt xem" value={totalViews._sum.viewCount || 0} icon={<Eye size={20}/>} color="purple" />
        <StatCard title="Bài viết tự động" value={autoPosts} icon={<TrendingUp size={20}/>} color="orange" />
        <StatCard title="CTR Trung bình" value="4.2%" icon={<MousePointer2 size={20}/>} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold dark:text-white">Bài viết mới cập nhật</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="px-6 py-4 font-bold">Tiêu đề</th>
                  <th className="px-6 py-4 font-bold">Danh mục</th>
                  <th className="px-6 py-4 font-bold text-center">Lượt xem</th>
                  <th className="px-6 py-4 font-bold text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold dark:text-zinc-200 line-clamp-1">{post.title}</p>
                      <p className="text-[10px] text-zinc-500">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                        {post.category?.name || "Tin tức"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium">{post.viewCount}</td>
                    <td className="px-6 py-4 text-right">
                      {post.isAuto ? (
                        <span className="text-[10px] font-black text-orange-500 uppercase italic">Bot</span>
                      ) : (
                        <span className="text-[10px] font-black text-green-500 uppercase italic">Manual</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
            <h4 className="font-bold mb-2">Trạng thái Server</h4>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs text-blue-100">Hoạt động bình thường</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span>Database (Supabase)</span>
                <span className="font-bold">98%</span>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-1">
                <div className="bg-white h-1 rounded-full w-[98%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h4 className="font-bold mb-4 dark:text-white">Lối tắt nhanh</h4>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction color="blue" label="Viết bài" />
              <QuickAction color="orange" label="Quảng cáo" />
              <QuickAction color="purple" label="SEO Tags" />
              <QuickAction color="zinc" label="Dọn Cache" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components nhỏ bổ trợ
function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black mt-1 dark:text-white leading-none">{value.toLocaleString()}</p>
    </div>
  );
}

function QuickAction({ color, label }: any) {
  return (
    <button className="p-3 text-[11px] font-bold border border-zinc-100 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition dark:text-zinc-400">
      {label}
    </button>
  );
}