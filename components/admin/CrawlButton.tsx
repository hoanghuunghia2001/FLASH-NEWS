"use client";

import { useState } from "react";
import { 
  Cpu, 
  Briefcase, 
  Gavel, 
  Globe, 
  Newspaper, 
  Zap, 
  Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CrawlControls() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const router = useRouter();

  // Danh sách cấu hình nút bấm khớp với route.ts
  const controls = [
    { name: "Công nghệ", slug: "cong-nghe", icon: <Cpu size={20}/>, color: "text-blue-500", bg: "bg-blue-50", border: "hover:border-blue-200" },
    { name: "Kinh doanh", slug: "kinh-doanh", icon: <Briefcase size={20}/>, color: "text-emerald-500", bg: "bg-emerald-50", border: "hover:border-emerald-200" },
    { name: "Pháp luật", slug: "phap-luat", icon: <Gavel size={20}/>, color: "text-red-500", bg: "bg-red-50", border: "hover:border-red-200" },
    { name: "Thế giới", slug: "the-gioi", icon: <Globe size={20}/>, color: "text-purple-500", bg: "bg-purple-50", border: "hover:border-purple-200" },
    { name: "Thời sự", slug: "thoi-su", icon: <Newspaper size={20}/>, color: "text-amber-500", bg: "bg-amber-50", border: "hover:border-amber-200" },
    { name: "Tin tức", slug: "tin-tuc", icon: <Zap size={20}/>, color: "text-rose-500", bg: "bg-rose-50", border: "hover:border-rose-200" },
  ];

  const handleCrawl = async (slug: string, name: string) => {
    if (!confirm(`Bắt đầu cào tin mới nhất mục "${name}" hôm nay?`)) return;

    setActiveTopic(slug);
    try {
      // Gửi request kèm theo tham số topic
      const response = await fetch(
        `/api/cron/crawl?key=${process.env.NEXT_PUBLIC_CRON_SECRET}&topic=${slug}`
      );
      const data = await response.json();

      if (data.status === "Success") {
        alert(`Hoàn tất: ${data.message}`);
        router.refresh(); 
      } else {
        alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      alert("Không thể kết nối với server.");
    } finally {
      setActiveTopic(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Zap size={14} className="fill-current text-orange-500" />
          Điều khiển Bot
        </h3>
        <span className="text-[10px] font-bold text-zinc-400 italic">Target: News Today</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {controls.map((item) => (
          <button
            key={item.slug}
            onClick={() => handleCrawl(item.slug, item.name)}
            disabled={activeTopic !== null}
            className={`
              relative flex flex-col items-center p-5 rounded-[2rem] border transition-all duration-300
              ${activeTopic === item.slug 
                ? "border-zinc-900 bg-zinc-900 scale-95 shadow-inner" 
                : `bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 shadow-sm ${item.border} hover:shadow-md hover:-translate-y-1`
              }
            `}
          >
            {/* Icon Circle */}
            <div className={`
              p-3 rounded-2xl mb-3 transition-colors
              ${activeTopic === item.slug 
                ? "bg-white/10 text-white" 
                : `${item.bg} ${item.color} dark:bg-zinc-800`
              }
            `}>
              {activeTopic === item.slug ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                item.icon
              )}
            </div>

            {/* Label */}
            <span className={`
              text-xs font-bold transition-colors
              ${activeTopic === item.slug ? "text-white" : "text-zinc-700 dark:text-zinc-300"}
            `}>
              {item.name}
            </span>

            {/* Indicator Light */}
            <div className={`
              absolute top-4 right-4 w-1.5 h-1.5 rounded-full transition-all
              ${activeTopic === item.slug 
                ? "bg-white animate-pulse shadow-[0_0_8px_white]" 
                : "bg-zinc-200 dark:bg-zinc-700"
              }
            `} />
          </button>
        ))}
      </div>
    </div>
  );
}