import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true }
  });

  if (!post) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId: post.categoryId,
      NOT: { id: post.id }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  const sidebarPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });


  console.log(post);
  
  return (
    <main className="bg-[#fcfaf6] dark:bg-zinc-950 min-h-screen pb-20">
      {/* Breadcrumb - Cố định độ cao để không đè nội dung */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center text-sm font-medium">
          <Link href="/" className="text-red-600 hover:underline mr-2">Trang chủ</Link>
          <span className="text-zinc-400 mr-2">/</span>
          <Link href={`/categories/${post.category?.slug}`} className="dark:text-zinc-300 hover:text-red-600 truncate">
            {post.category?.name}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* CỘT CHÍNH - Sử dụng lg:w-2/3 và overflow-hidden để chặn tràn layout */}
          <div className="lg:w-2/3 w-full overflow-hidden">
            <article>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-zinc-900 dark:text-white leading-tight">
                {post.title}
              </h1>
              
              <div className="flex justify-between items-center py-4 border-t border-zinc-100 dark:border-zinc-800 mb-4 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-zinc-700 dark:text-zinc-300">FLASH NEW</span>
                   <span>•</span>
                   <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div>
                {post.coverImage && (
                  <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover w-full h-full rounded-xl shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Nội dung bài viết - Thêm padding để tránh sát lề mobile */}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-p:text-zinc-800 dark:prose-p:text-zinc-300 prose-p:leading-8
                prose-img:rounded-xl prose-img:shadow-sm
                prose-strong:text-zinc-900 dark:prose-strong:text-white
                prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />

              {/* Tin liên quan */}
              <section className="mt-20 pt-10 border-t-2 border-zinc-900 dark:border-white">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-red-600 inline-block"></span>
                  Tin liên quan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedPosts.map((rel) => (
                    <Link key={rel.id} href={`/posts/${rel.slug}`} className="group flex gap-4 items-start">
                      <div className="relative w-32 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                        <Image 
                          src={rel.coverImage || '/placeholder.jpg'} 
                          alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <h3 className="text-sm font-bold group-hover:text-red-600 transition-colors line-clamp-3 text-zinc-900 dark:text-zinc-100 leading-snug">
                        {rel.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            </article>
          </div>

          {/* SIDEBAR - Sử dụng h-fit để không kéo dài vùng sticky vô nghĩa */}
          <aside className="lg:w-1/3 w-full">
            <div className="lg:sticky lg:top-32 space-y-12 h-fit">
              
              {/* Box Mới nhất */}
              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h2 className="text-lg font-bold mb-6 border-b border-red-600 pb-2 inline-block">
                  Mới nhất
                </h2>
                <div className="space-y-6">
                  {sidebarPosts.map((side, index) => (
                    <Link key={side.id} href={`/posts/${side.slug}`} className="flex gap-4 group items-start">
                      <span className="text-2xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-red-600 transition-colors">
                        {index + 1}
                      </span>
                      <h3 className="text-[14px] font-semibold leading-snug group-hover:text-red-600 text-zinc-900 dark:text-zinc-100 transition-colors">
                        {side.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Box Quảng cáo */}
              <div className="bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4 flex items-center justify-center text-zinc-400">
                   AD
                </div>
                <p className="text-zinc-400 text-xs italic leading-relaxed">
                  Trang web được phát triển bởi FLASHNEWS MEDIA.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}