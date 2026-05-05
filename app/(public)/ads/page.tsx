export default function AdsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-black mb-12">Hợp tác quảng cáo</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-zinc-900 text-white rounded-[2rem]">
          <h3 className="text-2xl font-bold mb-4">Native Ads</h3>
          <p className="text-zinc-400 mb-6">Lồng ghép thương hiệu vào các bài viết do AI biên tập một cách tự nhiên.</p>
          <ul className="text-sm space-y-2 text-zinc-300">
            <li>• Tỉ lệ click (CTR) cao hơn 40%</li>
            <li>• Hiển thị đa thiết bị</li>
          </ul>
        </div>
        <div className="p-8 border border-zinc-200 rounded-[2rem]">
          <h3 className="text-2xl font-bold mb-4">Data Insights</h3>
          <p className="text-zinc-500 mb-6">Tiếp cận độc giả dựa trên các chuyên mục xu hướng được AI phân tích.</p>
          <button className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold">Nhận báo giá</button>
        </div>
      </div>
    </div>
  );
}