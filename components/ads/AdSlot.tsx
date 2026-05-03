import prisma from "@/lib/prisma";

export default async function AdSlot({ location }: { location: string }) {
  const ad = await prisma.ad.findUnique({
    where: { location, isActive: true }
  });

  if (!ad || !ad.code) return null;

  return (
    <div className="my-8 flex justify-center w-full min-h-25">
      <div 
        className="ad-wrapper" 
        dangerouslySetInnerHTML={{ __html: ad.code }} 
      />
    </div>
  );
}