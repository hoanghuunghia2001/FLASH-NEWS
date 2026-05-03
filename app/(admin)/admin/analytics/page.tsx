import AnalyticsClient from "@/components/admin/AnalyticsClient";
import prisma from "@/lib/prisma";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  MousePointer2, 
  BarChart3,
  Zap,
  Globe
} from "lucide-react";

export default async function AnalyticsPage() {
  // 1. Fetch dữ liệu tổng quan
  const [
    totalPosts,
    totalViews,
    autoPosts,
    manualPosts,
    categories,
    recentViewData
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
    prisma.post.count({ where: { isAuto: true } }),
    prisma.post.count({ where: { isAuto: false } }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } }
    }),
    // Lấy dữ liệu 7 ngày gần nhất (giả lập dựa trên createdAt để vẽ biểu đồ)
    prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { title: true, viewCount: true, createdAt: true }
    })
  ]);

  const stats = [
    { label: "Tổng lượt xem", value: totalViews._sum.viewCount || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tổng bài viết", value: totalPosts, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Bài viết từ Bot", value: autoPosts, icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Tỷ lệ viết tay", value: `${((manualPosts / totalPosts) * 100).toFixed(1)}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight dark:text-white">Phân tích hệ thống</h1>
        <p className="text-zinc-500">Dữ liệu chi tiết về hiệu suất nội dung và tăng trưởng.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-2xl font-black mt-1 dark:text-white">{stat.value.toLocaleString()}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ tăng trưởng (Client Component) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-500" /> Xu hướng lượt xem
            </h3>
            <select className="bg-zinc-50 dark:bg-zinc-800 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <AnalyticsClient data={recentViewData} />
        </div>

        {/* Thống kê theo danh mục */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-lg mb-6 dark:text-white flex items-center gap-2">
            <Globe size={20} className="text-purple-500" /> Danh mục hot
          </h3>
          <div className="space-y-5">
            {categories.map((cat) => (
              <div key={cat.id} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold dark:text-zinc-300 group-hover:text-blue-500 transition">{cat.name}</span>
                  <span className="text-zinc-500">{cat._count.posts} bài</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(cat._count.posts / totalPosts) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
            <p className="text-[10px] text-zinc-400 uppercase font-black mb-2">Gợi ý từ AI</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
              Danh mục {categories[0]?.name} đang có tương tác cao nhất. Nghĩa nên đẩy thêm bài viết tự động vào khung giờ 8h sáng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}