import prisma from "@/lib/prisma";

export default async function AdDisplay({ location }: { location: 'HEADER' | 'SIDEBAR' | 'CONTENT_MIDDLE' }) {
  const ad = await prisma.ad.findUnique({
    where: { location },
  });

  // Nếu không có ad hoặc ad đang tắt thì không hiện gì cả
  if (!ad || !ad.isActive || !ad.code) return null;

// components/ads/AdDisplay.tsx
return (
  <div className="ad-container  flex justify-center w-full overflow-hidden m-0">
    <div 
      className="max-w-full"
      dangerouslySetInnerHTML={{ __html: ad.code }} 
      suppressHydrationWarning={true} // Thêm dòng này vào đây
    />
  </div>
);
}