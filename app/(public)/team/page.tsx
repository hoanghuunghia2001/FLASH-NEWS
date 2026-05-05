const members = [
  { name: "Hoàng Hữu Nghĩa", role: "Architect", desc: "Người đặt nền móng cho hệ thống cào tin và cấu trúc dữ liệu." },
  { name: "Gemini AI", role: "Content Engine", desc: "Trí tuệ nhân tạo chịu trách nhiệm biên tập và tối ưu SEO." },
  { name: "Flash Bot", role: "Crawler", desc: "Chiến binh thầm lặng thu thập tin tức 24/7 từ khắp nơi." }
];

export default function TeamPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32">
      <div className="mb-20">
        <h2 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Behind the scenes</h2>
        <h1 className="text-5xl font-black tracking-tighter">Những người kiến tạo.</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {members.map((m) => (
          <div key={m.name} className="group p-10 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-orange-500/50 transition-all">
            <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 mb-8 group-hover:w-full group-hover:bg-orange-500 transition-all duration-500"></div>
            <h3 className="text-2xl font-black mb-2">{m.name}</h3>
            <p className="text-orange-500 font-bold text-sm mb-6 uppercase tracking-wider">{m.role}</p>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed italic">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}