/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import Link from "next/link";
import AdSlot from "@/components/ads/AdSlot";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 12, // Lấy 12 bài mới nhất
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 border-l-4 border-blue-600 pl-4">Tin tức mới nhất</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: { slug: any; id: Key | null | undefined; coverImage: any; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; excerpt: any; createdAt: string | number | Date; isAuto: any; }) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group border rounded-xl overflow-hidden hover:shadow-lg transition">
            <div className="aspect-video bg-gray-100 overflow-hidden">
              {/* Nếu có ảnh cover thì hiện, không thì hiện ảnh placeholder */}
              <img 
                src={post.coverImage || "https://placehold.co/600x400?text=News"} 
                alt={post.title != null ? String(post.title) : "News"} 
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg leading-tight group-hover:text-blue-600 transition line-clamp-2">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                {post.excerpt || "Xem chi tiết bài viết tại đây..."}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                {post.isAuto && <span className="bg-gray-100 px-2 py-1 rounded text-blue-500 font-medium">Auto</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quảng cáo xen kẽ giữa trang chủ */}
      <div className="mt-12">
        <AdSlot location="SIDEBAR" />
      </div>
    </main>
  );
}