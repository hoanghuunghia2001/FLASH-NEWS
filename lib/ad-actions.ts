"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAdCode(id: string, code: string, isActive: boolean) {
  await prisma.ad.update({
    where: { id },
    data: { code, isActive }
  });
  revalidatePath('/'); // Refresh lại toàn bộ trang chủ/bài viết để nhận quảng cáo mới
  return { success: true };
}