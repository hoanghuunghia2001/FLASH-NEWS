'use client'

import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { runManualCrawl } from '@/app/actions/crawl'; // Import action vừa tạo

export default function CrawlButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({
    type: null,
    msg: ''
  });

  const handleCrawl = async () => {
    setLoading(true);
    setStatus({ type: null, msg: '' });

    const result = await runManualCrawl();

    if (result.status === "Success") {
      setStatus({ 
        type: 'success', 
        msg: `Tuyệt vời! Đã cập nhật thêm ${result.count} bài viết.` 
      });
    } else {
      setStatus({ 
        type: 'error', 
        msg: "Quá trình cào tin gặp sự cố. Vui lòng kiểm tra log server." 
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-end gap-3">
      <button 
        onClick={handleCrawl}
        disabled={loading}
        className={`group relative flex items-center gap-3 px-6 py-2.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-lg active:scale-95 ${
          loading 
          ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed" 
          : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
        }`}
      >
        <RefreshCw className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} size={18} />
        <span>{loading ? "HỆ THỐNG ĐANG QUÉT..." : "CÀO TIN THỦ CÔNG"}</span>
      </button>

      {/* Thông báo trạng thái đẹp hơn */}
      {status.msg && (
        <div className={`flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 rounded-lg animate-in slide-in-from-top-1 duration-300 ${
          status.type === 'success' 
          ? "bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400" 
          : "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400"
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {status.msg}
        </div>
      )}
    </div>
  );
}