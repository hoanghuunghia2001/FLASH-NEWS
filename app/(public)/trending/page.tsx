import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Eye, Calendar, Flame } from "lucide-react";

export const revalidate = 300; // Cập nhật mỗi 5 phút (Trend không cần nhảy giây như Latest)

export default async function TrendingPage() {
  // Lấy top 10 bài viết có lượt xem cao nhất
  const trendingPosts = await prisma.post.findMany({
    where: { 
      published: true,
      // Bạn có thể thêm điều kiện lấy bài trong 7 ngày qua nếu muốn
      // createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    },
    orderBy: { viewCount: "desc" },
    take: 12,
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header với hiệu ứng gradient */}
      <div className="relative mb-16 p-8 rounded-[40px] bg-zinc-900 overflow-hidden border border-zinc-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-orange-500 mb-4">
            <Flame size={24} fill="currentColor" />
            <span className="font-black uppercase tracking-widest text-sm">Xu hướng hiện nay</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            Hot Topics <span className="text-orange-500">.</span>
          </h1>
          <p className="text-zinc-400 mt-4 max-w-xl text-lg">
            Những nội dung được cộng đồng quan tâm và thảo luận nhiều nhất trong 24h qua.
          </p>
        </div>
      </div>

      {/* Grid bài viết xu hướng */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {trendingPosts.map((post, index) => (
          <Link 
            href={`/posts/${post.slug}`} 
            key={post.id}
            className={`group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden transition-all hover:-translate-y-2 
              ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
          >
            {/* Rank Number */}
            <div className="absolute top-4 left-4 z-20 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <span className="text-white font-black text-sm italic">#{index + 1}</span>
            </div>

            <div className={`relative overflow-hidden ${index === 0 ? "aspect-video lg:aspect-auto lg:h-[350px]" : "aspect-video"}`}>
              <Image
                src={post.coverImage || "/placeholder-news.jpg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-[10px] font-black uppercase text-orange-500">
                  {post.category?.name}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold">
                  <Eye size={12} />
                  {post.viewCount?.toLocaleString()} views
                </div>
              </div>

              <h2 className={`font-bold dark:text-white group-hover:text-orange-500 transition-colors leading-tight
                ${index === 0 ? "text-2xl md:text-3xl" : "text-lg line-clamp-2"}`}>
                {post.title}
              </h2>

              {index === 0 && (
                <p className="mt-4 text-zinc-500 dark:text-zinc-400 line-clamp-3 text-sm">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                <Calendar size={12} />
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}