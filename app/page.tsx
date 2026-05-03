/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home() {
  // Lấy danh sách bài viết từ database (Sử dụng Prisma)
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Khám phá thế giới <br /> 
            <span className="text-blue-600">Lập trình & Công nghệ</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            Nơi chia sẻ những kinh nghiệm thực chiến, hướng dẫn chi tiết về Next.js, Prisma và hệ sinh thái công nghệ mới nhất.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#posts" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-blue-500/20">
              Đọc Blog
            </Link>
            <Link href="/about" className="border border-zinc-300 dark:border-zinc-700 px-8 py-3 rounded-full font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section id="posts" className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Bài viết mới nhất</h2>
          <Link href="/posts" className="text-blue-600 text-sm font-semibold hover:underline">Xem tất cả →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            // Hiển thị khung trống nếu chưa có bài viết
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-200 dark:bg-zinc-800 aspect-video rounded-2xl mb-4"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

// Component thẻ bài viết
function PostCard({ post }: { post: any }) {
  console.log(post);
  
  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-video overflow-hidden rounded-2xl mb-4 bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={post.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
          alt={post.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs font-medium text-blue-600 uppercase tracking-widest">
          <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
          <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
          <span>5 min read</span>
        </div>
        <h3 className="text-xl font-bold leading-snug group-hover:text-blue-600 transition">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm leading-relaxed">
          {post.description || "Khám phá chi tiết nội dung bài viết thú vị này tại My Pro Blog..."}
        </p>
      </div>
    </article>
  );
}