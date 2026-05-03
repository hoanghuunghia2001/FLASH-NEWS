import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Định nghĩa Interface chuẩn cho Next.js 15
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await params để lấy slug từ URL
  const { slug } = await params;

  // Lấy dữ liệu category và bài viết liên quan
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 15, // Lấy 15 bài mới nhất trong mục này
      }
    }
  });

  // Nếu không tìm thấy category trong DB, trả về trang 404
  if (!category) notFound();

  // Xử lý trường hợp chưa có bài viết nào
  if (category.posts.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold uppercase text-red-600">{category.name}</h1>
        <div className="mt-8 p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-zinc-500">Hiện chưa có nội dung cho chuyên mục này. Vui lòng quay lại sau.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Quay về trang chủ
          </Link>
        </div>
      </main>
    );
  }

  // Tách bài đầu tiên làm "Tiêu điểm", còn lại là "Danh sách"
  const [featuredPost, ...otherPosts] = category.posts;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER DANH MỤC */}
      <div className="flex items-baseline gap-4 border-b-2 border-zinc-900 dark:border-white pb-3 mb-10">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-red-600">
          {category.name}
        </h1>
        <nav className="hidden md:flex gap-4 text-sm text-zinc-500 font-medium">
          <span className="text-zinc-300">|</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Mới nhất</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Xem nhiều</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* CỘT CHÍNH (8 CỘT) */}
        <div className="lg:col-span-8">
          
          {/* BÀI VIẾT TIÊU ĐIỂM (Featured) */}
          <article className="group mb-12">
            <Link href={`/posts/${featuredPost.slug}`} className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100">
                  <Image
                    src={featuredPost.coverImage || "/placeholder.jpg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority // Ưu tiên load ảnh này vì nó to nhất trang
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <h2 className="text-2xl font-bold leading-tight group-hover:text-red-600 transition-colors mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-[15px] line-clamp-4 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-3 text-xs text-zinc-400">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 italic">VnExpress Clone</span>
                  <span>•</span>
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </Link>
          </article>

          <hr className="mb-10 border-zinc-200 dark:border-zinc-800" />

          {/* DANH SÁCH BÀI VIẾT TIẾP THEO */}
          <div className="space-y-10">
            {otherPosts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/posts/${post.slug}`} className="flex gap-5 md:gap-8">
                  <div className="flex-1 order-2 md:order-1">
                    <h3 className="text-lg font-bold group-hover:text-red-600 transition-colors mb-2 line-clamp-2 md:line-clamp-none">
                      {post.title}
                    </h3>
                    <p className="text-[14px] text-zinc-500 dark:text-zinc-400 line-clamp-2 hidden md:block leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="relative w-28 h-18 md:w-52 md:h-32 flex-shrink-0 order-1 md:order-2 overflow-hidden rounded-lg bg-zinc-100">
                    <Image
                      src={post.coverImage || "/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* NÚT XEM THÊM (Optional) */}
          <div className="mt-12 text-center">
            <button className="px-8 py-2 border border-zinc-300 dark:border-zinc-700 rounded-full text-sm font-semibold hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              Xem thêm bài viết
            </button>
          </div>
        </div>

        {/* SIDEBAR (4 CỘT) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-12">
            
            {/* BOX ĐỌC NHIỀU */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-red-600"></div>
                <h2 className="font-black text-xl tracking-tight uppercase">Đọc nhiều</h2>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {otherPosts.slice(0, 5).map((p, i) => (
                  <Link key={p.id} href={`/posts/${p.slug}`} className="flex gap-4 py-4 group first:pt-0">
                    <span className="text-3xl font-black text-zinc-100 dark:text-zinc-800 group-hover:text-red-500 transition-colors">
                      {i + 1}
                    </span>
                    <h4 className="text-[14px] font-bold leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                      {p.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </section>

            {/* BOX QUẢNG CÁO GIẢ */}
            <div className="relative group">
              <div className="w-full h-[400px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 text-center">
                <div className="absolute top-2 right-2 text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Sponsored</div>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Đăng ký bản tin</h3>
                <p className="text-xs text-zinc-500 mb-6 leading-relaxed">Nhận những tin tức mới nhất từ chuyên mục {category.name} hàng ngày.</p>
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
                <button className="w-full bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">ĐĂNG KÝ NGAY</button>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </main>
  );
}