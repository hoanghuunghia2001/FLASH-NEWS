export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-5xl font-black tracking-tighter mb-10">Điều khoản dịch vụ</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Chấp nhận điều khoản</h2>
          <p>Bằng việc truy cập FlashNews, bạn đồng ý tuân thủ các điều khoản này. Chúng tôi có quyền thay đổi nội dung điều khoản bất kỳ lúc nào mà không cần thông báo trước.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. Quyền sở hữu trí tuệ</h2>
          <p>Mọi nội dung trên FlashNews (bao gồm văn bản đã qua biên tập bởi AI, giao diện, logo) thuộc sở hữu của FlashNews. Bạn không được phép sao chép cho mục đích thương mại khi chưa có sự đồng ý.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. Giới hạn trách nhiệm</h2>
          <p>Nội dung được tổng hợp tự động từ nhiều nguồn. Chúng tôi nỗ lực đảm bảo độ chính xác nhưng không chịu trách nhiệm về các sai sót khách quan từ nguồn tin gốc.</p>
        </section>
      </div>
    </div>
  );
}