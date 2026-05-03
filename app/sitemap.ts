/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Lấy URL từ biến môi trường, nếu không có thì mặc định là localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  })

  const postUrls = posts.map((post: { slug: any; updatedAt: any }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ]
}