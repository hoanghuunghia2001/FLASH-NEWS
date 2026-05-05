export default function CareersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-32">
      <div className="text-center mb-24">
        <h1 className="text-6xl font-black tracking-tighter mb-6">Build the future.</h1>
        <p className="text-zinc-500 text-xl font-medium">Chúng tôi luôn tìm kiếm những bộ óc sáng tạo nhất.</p>
      </div>

      <div className="space-y-4">
        {[
          { title: "Backend Engineer", type: "Full-time", loc: "Remote" },
          { title: "AI Prompt Specialist", type: "Contract", loc: "Bình Dương" },
          { title: "UI/UX Designer", type: "Full-time", loc: "Remote" }
        ].map((j) => (
          <div key={j.title} className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer">
            <div>
              <h3 className="text-xl font-bold mb-1">{j.title}</h3>
              <div className="flex gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <span>{j.type}</span>
                <span>•</span>
                <span>{j.loc}</span>
              </div>
            </div>
            <div className="mt-6 md:mt-0 px-8 py-3 rounded-full bg-black dark:bg-white dark:text-black text-white text-xs font-black uppercase tracking-widest group-hover:bg-orange-500 group-hover:text-white transition-colors">
              Apply Now
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}