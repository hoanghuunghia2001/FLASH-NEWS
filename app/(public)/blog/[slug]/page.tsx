import AdSlot from "@/components/ads/AdSlot";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Share2, Clock, ChevronRight } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({ 
    where: { slug: params.slug } 
  });
  
  if (!post) return { title: "Không tìm thấy bài viết" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: `${post.metaTitle || post.title} | My Pro Blog`,
    description: post.metaDescription || post.excerpt || post.title,
    alternates: {
      canonical: post.isAuto && post.sourceUrl ? post.sourceUrl : `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || "",
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: post.coverImage || "/og-default.jpg" }],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

export default async function PostDetail({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { 
      category: true,
      // Giả sử bạn có quan hệ author hoặc lấy bài liên quan cùng category
    }
  });

  if (!post) notFound();

  // Background Update View Count
  try {
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });
  } catch (e) {
    console.error("Failed to update view count", e);
  }

  // Lấy bài viết liên quan (Cùng danh mục, trừ bài hiện tại)
  const relatedPosts = await prisma.post.findMany({
    where: { 
      categoryId: post.categoryId,
      NOT: { id: post.id },
      published: true 
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* 1. Thanh tiến trình đọc (Client Component - bạn có thể tạo riêng) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-600 z-50 origin-left" id="reading-progress"></div>

      <article className="max-w-5xl mx-auto px-4 pt-10 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-900 dark:text-zinc-300 truncate">{post.title}</span>
        </nav>

        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          {post.category && (
            <Link href={`/category/${post.category.slug}`} className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              {post.category.name}
            </Link>
          )}

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight dark:text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-zinc-500 dark:text-zinc-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>6 phút đọc</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{post.viewCount + 1} lượt xem</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="relative aspect-[21/9] w-full mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 w-full lg:max-w-[70%]">
            <AdSlot location="HEADER" />

            <div 
              className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none 
                         prose-headings:font-black prose-a:text-blue-600 prose-img:rounded-3xl 
                         prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:py-1 prose-blockquote:px-6"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            <div className="my-10">
              <AdSlot location="CONTENT_MIDDLE" />
            </div>

            {/* Source for auto-posts */}
            {post.isAuto && post.sourceUrl && (
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
                  Nguồn bài viết: 
                  <a href={post.sourceUrl} target="_blank" className="ml-2 text-blue-600 font-bold hover:underline">
                    {new URL(post.sourceUrl).hostname}
                  </a>
                </p>
              </div>
            )}

            {/* Social Share Footer */}
            <div className="mt-12 p-8 rounded-3xl bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Thấy bài viết này hữu ích?</h3>
                <p className="text-blue-100">Chia sẻ ngay để lan tỏa kiến thức đến cộng đồng!</p>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition"><Share2 size={20} /></button>
                <button className="px-6 py-2 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition">Facebook</button>
              </div>
            </div>
          </div>

          {/* Sidebar (Dùng cho Desktop) */}
          <aside className="hidden lg:block w-full lg:max-w-[30%] space-y-10">
             <div className="sticky top-24">
                <h4 className="text-lg font-black mb-4 uppercase tracking-tighter">Bài viết liên quan</h4>
                <div className="space-y-6">
                  {relatedPosts.map(p => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                         <Image src={p.coverImage || "/og-default.jpg"} alt={p.title} fill className="object-cover group-hover:scale-105 transition" />
                      </div>
                      <h5 className="font-bold leading-tight group-hover:text-blue-600 transition line-clamp-2 italic">{p.title}</h5>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-10 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                   <p className="font-bold mb-2">Quảng cáo</p>
                   <AdSlot location="SIDEBAR" />
                </div>
             </div>
          </aside>
        </div>
      </article>
    </div>
  );
}