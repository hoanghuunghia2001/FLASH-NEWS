import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Clock, Tag, ExternalLink } from "lucide-react";

export const revalidate = 60; // Cập nhật lại trang mỗi 60 giây

export default async function LatestNewsPage() {
  // Fetch 20 bài viết mới nhất
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white">
            Tin mới nhất <span className="text-blue-600">.</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">
            Cập nhật những tin tức nóng hổi từ hệ thống FlashNews.
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-2xl text-sm font-bold">
          Tổng cộng: {posts.length} bài viết
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
          >
            {/* Ảnh Cover */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.coverImage || "https://images.unsplash.com/photo-1504711432869-efd597cdd042?q=80&w=1000"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  {post.category?.name || "Chung"}
                </span>
              </div>
              {post.isAuto && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white p-1.5 rounded-full shadow-lg">
                  <Clock size={14} className="animate-pulse" />
                </div>
              )}
            </div>

            {/* Nội dung bài viết */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-3 font-medium uppercase tracking-wider">
                <Clock size={12} />
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                <span>•</span>
                <span>{post.isAuto ? "AI Tổng hợp" : "Biên tập viên"}</span>
              </div>

              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-bold dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-3">
                  {post.title}
                </h2>
              </Link>

              <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link 
                  href={`/posts/${post.slug}`}
                  className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-zinc-900 dark:text-white"
                >
                  Đọc tiếp <ExternalLink size={14} />
                </Link>
                
                {post.sourceUrl && (
                  <a 
                    href={post.sourceUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-blue-500 underline uppercase font-bold"
                  >
                    Nguồn gốc
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}