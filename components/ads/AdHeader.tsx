import prisma from "@/lib/prisma";

export default async function AdHeader() {
  // Lấy quảng cáo vị trí HEADER từ DB
  const ad = await prisma.ad.findUnique({
    where: { location: 'HEADER' },
  });

  // Nếu không hoạt động hoặc không có code thì không hiện gì
  if (!ad || !ad.isActive || !ad.code) return null;

  return (
    <div className="w-full flex justify-center py-4 bg-zinc-50 dark:bg-zinc-900/50">
      <div 
        className="max-w-7xl mx-auto px-4 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: ad.code }} 
      />
    </div>
  );
}