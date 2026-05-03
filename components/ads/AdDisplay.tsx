import prisma from "@/lib/prisma";

export default async function AdDisplay({ location }: { location: 'HEADER' | 'SIDEBAR' | 'CONTENT_MIDDLE' }) {
  const ad = await prisma.ad.findUnique({
    where: { location },
  });

  // Nếu không có ad hoặc ad đang tắt thì không hiện gì cả
  if (!ad || !ad.isActive || !ad.code) return null;

  return (
    <div className="ad-container my-8 flex justify-center w-full overflow-hidden">
      {/* Dùng dangerouslySetInnerHTML để render script của Google Adsense hoặc HTML Banner */}
      <div 
        className="max-w-full"
        dangerouslySetInnerHTML={{ __html: ad.code }} 
      />
    </div>
  );
}