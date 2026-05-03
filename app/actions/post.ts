'use server'
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function savePost(formData: FormData) {
  const title = formData.get('title') as string
  const slug = title.toLowerCase().replace(/ /g, '-')
  
  await prisma.post.create({
    data: {
      title,
      slug,
      content: formData.get('content') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      published: true,
    }
  })
  revalidatePath('/') // Cập nhật lại cache trang chủ ngay lập tức
}