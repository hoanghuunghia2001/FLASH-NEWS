import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  FileText, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Eye, 
  Search,
  Filter
} from "lucide-react";

export default async function AdminPostList() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true } // Lấy thêm tên danh mục nếu có
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight dark:text-white">Danh sách bài viết</h1>
          <p className="text-zinc-500 text-sm mt-1">Quản lý tổng số {posts.length} nội dung trên hệ thống.</p>
        </div>
        <Link 
          href="/admin/posts/new" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span>Viết bài mới</span>
        </Link>
      </div>

      {/* Filter Bar (Giao diện giả lập, Nghĩa có thể thêm logic sau) */}
      <div className="flex flex-wrap gap-3 py-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
          <Filter size={18} />
          <span>Lọc</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 text-[10px] uppercase tracking-widest text-zinc-400">
                <th className="px-6 py-4 font-bold">Bài viết</th>
                <th className="px-6 py-4 font-bold text-center">Nguồn</th>
                <th className="px-6 py-4 font-bold text-center">Lượt xem</th>
                <th className="px-6 py-4 font-bold">Ngày đăng</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {posts.map((post) => (
                <tr key={post.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="max-w-[300px]">
                        <p className="text-sm font-bold dark:text-zinc-200 line-clamp-1 group-hover:text-blue-600 transition">
                          {post.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-tighter">
                          Slug: {post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {post.isAuto ? (
                      <span className="text-[10px] font-black text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1 rounded-full uppercase italic">Bot</span>
                    ) : (
                      <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full uppercase italic">Admin</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <Eye size={14} />
                      <span className="text-sm font-mono font-medium">{post.viewCount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/posts/${post.slug}`} 
                        target="_blank"
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                        title="Xem bài viết"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button 
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                        title="Xóa bài"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {posts.length === 0 && (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4">
              <FileText size={32} />
            </div>
            <p className="text-zinc-500 font-medium">Chưa có bài viết nào được tìm thấy.</p>
          </div>
        )}
      </div>
    </div>
  );
}