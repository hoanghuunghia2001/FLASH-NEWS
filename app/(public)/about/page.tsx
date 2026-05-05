export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
          TIN TỨC <br /> <span className="text-orange-500">TỰ ĐỘNG HÓA.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-zinc-500 dark:text-zinc-400 font-medium">
          FlashNews không chỉ là một trang tin. Chúng tôi là một thử nghiệm công nghệ về cách AI có thể định hình lại dòng chảy thông tin toàn cầu.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-t border-zinc-100 dark:border-zinc-900">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[4rem] overflow-hidden">
             {/* Bạn có thể chèn ảnh minh họa AI ở đây */}
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
          </div>
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 rounded-full border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest">
              Our Vision
            </div>
            <h2 className="text-4xl font-black leading-tight">Biên tập viên không bao giờ ngủ.</h2>
            <p className="text-lg text-zinc-500 leading-relaxed">
              Mỗi giây, hệ thống của chúng tôi quét hàng ngàn nguồn tin, phân tích ngữ nghĩa và tái cấu trúc nội dung bằng mô hình Gemini 1.5 Flash. Kết quả là những bản tin cô đọng, khách quan và hoàn toàn mới mẻ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}