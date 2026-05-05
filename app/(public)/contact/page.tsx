export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-black mb-6">Liên hệ</h1>
          <p className="text-zinc-500 mb-8">Mọi ý kiến đóng góp hoặc phản hồi về nội dung, vui lòng gửi về tòa soạn.</p>
          <div className="space-y-4 font-medium">
            <p>📍 Địa chỉ: Bến Cát, Bình Dương, Việt Nam</p>
            <p>📧 Email: contact@flashnews.vn</p>
            <p>📞 Hotline: 0123-XXX-XXX</p>
          </div>
        </div>
        <form className="space-y-4 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-[2rem]">
          <input type="text" placeholder="Họ và tên" className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent" />
          <input type="email" placeholder="Email" className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent" />
          <textarea placeholder="Nội dung thông điệp" rows={4} className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent"></textarea>
          <button className="w-full py-4 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-xl font-bold">Gửi tin nhắn</button>
        </form>
      </div>
    </div>
  );
}