/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Save, RefreshCcw } from "lucide-react";
import { updateAdCode } from "@/lib/ad-actions";

export default function AdForm({ ad }: { ad: any }) {
  const [code, setCode] = useState(ad.code);
  const [isActive, setIsActive] = useState(ad.isActive);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateAdCode(ad.id, code, isActive);
    setLoading(false);
    alert("Đã cập nhật cấu hình quảng cáo!");
  };

  return (
    <div className="space-y-4 mt-auto">
      <div className="relative group">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-32 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl font-mono text-[10px] outline-none focus:ring-2 ring-blue-500/20 transition-all resize-none"
          placeholder="Dán mã Script/HTML tại đây..."
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <RefreshCcw size={14} className="text-zinc-400 cursor-pointer hover:rotate-180 transition-all duration-500" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-bold dark:text-zinc-400 text-zinc-600">Kích hoạt</span>
        </label>
        
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </div>
  );
}