export default function CopyrightPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="inline-block p-4 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 mb-6">
        <svg  fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h1 className="text-5xl font-black tracking-tighter mb-6">Khiếu nại bản quyền (DMCA)</h1>
      <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto">FlashNews tôn trọng quyền sở hữu trí tuệ của các bên. Nếu bạn tin rằng nội dung của mình bị sử dụng không đúng cách, hãy làm theo quy trình dưới đây.</p>
      
      <div className="text-left bg-zinc-50 dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-lg mb-4">Quy trình yêu cầu gỡ bỏ:</h3>
        <ol className="space-y-4 text-zinc-600 dark:text-zinc-400 list-decimal ml-5">
          <li>Gửi Email về địa chỉ: <strong>copyright@flashnews.vn</strong></li>
          <li>Cung cấp đường dẫn (URL) bài viết trên FlashNews cần gỡ bỏ.</li>
          <li>Cung cấp bằng chứng chứng minh quyền sở hữu nội dung gốc.</li>
          <li>Chúng tôi sẽ xử lý và phản hồi trong vòng 24h - 48h làm việc.</li>
        </ol>
      </div>
    </div>
  );
}