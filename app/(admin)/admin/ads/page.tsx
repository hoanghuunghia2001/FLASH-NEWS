import AdForm from "@/components/ads/AdForm";
import prisma from "@/lib/prisma";
import { Layout, Monitor, Sidebar, FileCode, CheckCircle2, XCircle } from "lucide-react";

export default async function AdsManagerPage() {
  const ads = await prisma.ad.findMany({
    orderBy: { location: 'asc' }
  });

  // Nếu DB trống, tạo sẵn các vị trí mặc định cho Nghĩa
  if (ads.length === 0) {
    const locations = ['HEADER', 'SIDEBAR', 'CONTENT_MIDDLE'];
    for (const loc of locations) {
      await prisma.ad.create({
        data: { location: loc, code: '<!-- Chèn mã quảng cáo tại đây -->', isActive: false }
      });
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight dark:text-white">Cấu hình Quảng cáo</h1>
        <p className="text-zinc-500">Tối ưu hóa doanh thu bằng cách quản lý các vị trí đặt Banner/Script.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${ad.isActive ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'} dark:bg-zinc-800`}>
                {ad.location === 'HEADER' && <Monitor size={24} />}
                {ad.location === 'SIDEBAR' && <Sidebar size={24} />}
                {ad.location === 'CONTENT_MIDDLE' && <Layout size={24} />}
              </div>
              <div className="flex items-center gap-2">
                {ad.isActive ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase italic">
                    <CheckCircle2 size={12} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase italic">
                    <XCircle size={12} /> Inactive
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-black text-xl mb-1 dark:text-white">{ad.location}</h3>
            <p className="text-xs text-zinc-500 mb-6">Vị trí hiển thị: {
              ad.location === 'HEADER' ? 'Đầu trang (Dưới Menu)' : 
              ad.location === 'SIDEBAR' ? 'Cột bên phải bài viết' : 'Giữa nội dung bài viết'
            }</p>

            {/* Client Component để xử lý sửa đổi */}
            <AdForm ad={ad} />
          </div>
        ))}
      </div>

      {/* Tip dành cho Nghĩa */}
      <div className="bg-blue-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-500/20">
        <div className="bg-white/20 p-4 rounded-2xl">
          <FileCode size={32} />
        </div>
        <div>
          <h4 className="font-bold text-lg">Mẹo tối ưu Adsense</h4>
          <p className="text-blue-100 text-sm max-w-2xl">
            Với các bài viết cào tự động, Nghĩa nên ưu tiên vị trí <strong>CONTENT_MIDDLE</strong>. 
            Đây là nơi có tỷ lệ Click (CTR) cao nhất vì quảng cáo nằm ngay trong mạch đọc của người dùng.
          </p>
        </div>
      </div>
    </div>
  );
}