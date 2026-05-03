/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

const parser = new Parser();

// Cấu hình danh sách các mục cần cào để tạo dữ liệu phong phú cho Sidebar/Related
const CATEGORIES_TO_CRAWL = [
  { name: 'Thời sự', slug: 'thoi-su', url: 'https://vnexpress.net/rss/thoi-su.rss' },
  { name: 'Pháp luật', slug: 'phap-luat', url: 'https://vnexpress.net/rss/phap-luat.rss' },
  { name: 'Thế giới', slug: 'the-gioi', url: 'https://vnexpress.net/rss/the-gioi.rss' },
  { name: 'Kinh doanh', slug: 'kinh-doanh', url: 'https://vnexpress.net/rss/kinh-doanh.rss' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let totalUpdated = 0;

    for (const catConfig of CATEGORIES_TO_CRAWL) {
      // 1. Tạo/Lấy Category
      const category = await prisma.category.upsert({
        where: { slug: catConfig.slug },
        update: {},
        create: {
          name: catConfig.name,
          slug: catConfig.slug,
        },
      });

      // 2. Parse RSS
      const feed = await parser.parseURL(catConfig.url);
      // Lấy 8 bài mỗi mục để tránh timeout trên Vercel (tổng 32 bài)
      const items = feed.items.slice(0, 8);

      for (const item of items) {
        const sourceUrl = item.link || "";
        const slug = sourceUrl.split('/').pop()?.replace('.html', '') || "";
        if (!slug) continue;

        let fullContent = "";
        let coverImage = "";

        try {
          const response = await fetch(sourceUrl, { 
            next: { revalidate: 3600 },
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          const html = await response.text();
          const $ = cheerio.load(html);

          // Lấy ảnh gốc từ meta
          coverImage = $('meta[property="og:image"]').attr('content') || "";

          // Tìm nội dung chính
          const detailElement = $('.fck_detail');
          
          if (detailElement.length > 0) {
            // XÓA RÁC: loại bỏ quảng cáo, bài liên quan chèn giữa bài, video lỗi
            detailElement.find('.vne_shortcode_video, .table_relate, .box_embed_video, .sidebar-item, .banner_ads, .tplCaption, [style*="display:none"]').remove();
            
            // Xử lý ảnh: VnExpress hay để lazy load trong data-src
            detailElement.find('img').each((_, img) => {
              const dataSrc = $(img).attr('data-src') || $(img).attr('src');
              if (dataSrc) {
                $(img).attr('src', dataSrc).removeAttr('data-src').addClass('mx-auto rounded-lg my-4');
              }
            });

            // Lấy HTML đã làm sạch
            fullContent = detailElement.html() || "";
          } else {
            fullContent = item.content || item.contentSnippet || "";
          }
        } catch (e) {
          console.error(`Lỗi cào tin ${sourceUrl}`);
          fullContent = item.content || item.contentSnippet || "";
        }

        // 3. Lưu vào Database
        await prisma.post.upsert({
          where: { slug },
          update: {
            content: fullContent,
            coverImage: coverImage || undefined,
            categoryId: category.id, // Cập nhật đúng category nếu bài chuyển mục
          },
          create: {
            title: item.title || "No Title",
            slug: slug,
            content: fullContent,
            excerpt: item.contentSnippet?.replace(/<[^>]*>?/gm, '').substring(0, 160),
            coverImage: coverImage,
            sourceUrl: sourceUrl,
            isAuto: true,
            published: true,
            categoryId: category.id,
            metaTitle: item.title,
          },
        });
        totalUpdated++;
      }
    }

    return NextResponse.json({
      status: "Success",
      message: `Đã cập nhật ${totalUpdated} bài viết từ 4 danh mục.`,
    });

  } catch (error: any) {
    return NextResponse.json({ status: "Error", message: error.message }, { status: 500 });
  }
}