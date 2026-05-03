import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Save, Send, ArrowLeft, Globe, Settings, FileText } from "lucide-react";
import Link from "next/link";

export default function NewPost() {
  async function createPost(formData: FormData) {
    'use server'
    const title = formData.get('title') as string;
    
    // Logic tạo slug tiếng Việt chuẩn hơn
    const slug = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Khử dấu tiếng Việt
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    await prisma.post.create({
      data: {
        title,
        slug,
        content: formData.get('content') as string,
        excerpt: formData.get('excerpt') as string,
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        published: true,
        isAuto: false, // Bài viết tay
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/posts');
    redirect('/admin/posts');
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Bar điều hướng */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/posts" 
            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            <ArrowLeft size={20} className="text-zinc-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight dark:text-white text-zinc-900">Viết bài mới</h1>
            <p className="text-xs text-zinc-500">Tạo nội dung mới cho FlashNews của bạn</p>
          </div>
        </div>
      </div>

      <form action={createPost} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT CHÍNH: NỘI DUNG */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-zinc-300">Tiêu đề bài viết</label>
              <input 
                name="title" 
                required 
                className="w-full text-xl font-bold bg-transparent border-b border-zinc-100 dark:border-zinc-800 pb-3 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-300" 
                placeholder="Ví dụ: 10 Cách học Next.js 15 cực nhanh..." 
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2 dark:text-zinc-300">
                <FileText size={16} /> Nội dung chi tiết
              </label>
              <textarea 
                name="content" 
                rows={18} 
                required 
                className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl font-mono text-sm focus:ring-2 ring-blue-500/20 outline-none transition-all shadow-inner" 
                placeholder="Hỗ trợ Markdown hoặc HTML tại đây..." 
              />
            </div>
          </div>
        </div>

        {/* CỘT PHỤ: CẤU HÌNH & SEO */}
        <div className="space-y-6">
          {/* Box SEO */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold mb-4 dark:text-white">
              <Globe size={18} className="text-blue-500" /> Tối ưu SEO
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-black text-zinc-400 mb-1">Meta Title</label>
                <input 
                  name="metaTitle" 
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition" 
                  placeholder="Tiêu đề hiển thị trên Google"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-black text-zinc-400 mb-1">Meta Description</label>
                <textarea 
                  name="metaDescription" 
                  rows={3}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition" 
                  placeholder="Mô tả ngắn cho công cụ tìm kiếm..."
                />
              </div>
            </div>
          </div>

          {/* Box Tóm tắt */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold mb-4 dark:text-white text-sm">
              <Settings size={18} className="text-orange-500" /> Trình trích dẫn
            </h3>
            <textarea 
              name="excerpt" 
              rows={3}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition" 
              placeholder="Một đoạn mô tả ngắn thu hút người đọc ngoài trang chủ..."
            />
          </div>

          {/* Nút hành động */}
          <div className="sticky top-6 space-y-3 pt-4">
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 group"
            >
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Đăng bài ngay
            </button>
            <button 
              type="button" 
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold py-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              <Save size={18} />
              Lưu bản nháp
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}