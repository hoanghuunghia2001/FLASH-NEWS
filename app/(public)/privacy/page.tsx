export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-5xl font-black tracking-tighter mb-10">Chính sách bảo mật</h1>
      <div className="space-y-12">
        <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-black mb-4">Thông tin chúng tôi thu thập</h2>
          <p className="text-zinc-500 leading-relaxed">Chúng tôi chỉ thu thập các thông tin cơ bản như địa chỉ IP, loại trình duyệt và hành vi sử dụng thông qua Cookie để cải thiện trải nghiệm người dùng.</p>
        </div>
        <div className="p-8 rounded-[2.5rem] bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
          <h2 className="text-xl font-black text-orange-600 dark:text-orange-400 mb-4">Cam kết bảo mật</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">FlashNews cam kết không bán, chia sẻ hay tiết lộ dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích tiếp thị.</p>
        </div>
      </div>
    </div>
  );
}