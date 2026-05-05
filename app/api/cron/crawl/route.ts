/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Cấu hình Parser & Gemini
const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// 2. Danh sách 6 nguồn tin theo yêu cầu
const SOURCES_CONFIG = [
  { name: 'Công nghệ', slug: 'cong-nghe', url: 'https://vietnamnet.vn/rss/cong-nghe.rss' },
  { name: 'Kinh doanh', slug: 'kinh-doanh', url: 'https://vnexpress.net/rss/kinh-doanh.rss' },
  { name: 'Pháp luật', slug: 'phap-luat', url: 'https://vnexpress.net/rss/phap-luat.rss' },
  { name: 'Thế giới', slug: 'the-gioi', url: 'https://vnexpress.net/rss/the-gioi.rss' },
  { name: 'Thời sự', slug: 'thoi-su', url: 'https://vnexpress.net/rss/thoi-su.rss' },
  { name: 'Tin tức', slug: 'tin-tuc', url: 'https://vnexpress.net/rss/tin-noi-bat.rss' }
];

// 3. Hàm lấy Selector nội dung dựa trên URL
function getSelector(url: string) {
  if (url.includes('vnexpress.net')) return '.fck_detail';
  if (url.includes('tuoitre.vn')) return '.fck-content, #main-detail-body';
  if (url.includes('thanhnien.vn')) return '.detail-content';
  if (url.includes('vietnamnet.vn')) return '#maincontent';
  return 'article';
}

// 4. Hàm AI viết lại bài báo
async function rewriteWithAI(title: string, rawContent: string) {
  try {
    const cleanContent = rawContent.replace(/<[^>]*>?/gm, '').substring(0, 3000);
    const prompt = `Bạn là một biên tập viên tin tức tài năng cho tờ báo "FlashNews". 
    Nhiệm vụ: Viết lại bài báo dưới đây để không bị trùng lặp bản quyền, giữ phong cách chuyên nghiệp, khách quan và hiện đại.
    
    Yêu cầu:
    - Tiêu đề: Sáng tạo, thu hút, chuẩn SEO.
    - Nội dung: Viết lại toàn bộ theo văn phong mới, mạch lạc, giữ lại các thông số và sự thật.
    - Định dạng: Giữ lại các thẻ HTML <strong> và <p>. Loại bỏ các thẻ khác.
    - Đầu ra: Trả về duy nhất định dạng JSON: {"title": "...", "content": "...", "excerpt": "..."}

    Bài gốc:
    Tiêu đề: ${title}
    Nội dung: ${cleanContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Rewrite Error:", error);
    return null;
  }
}

// 5. API Handler chính
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const topic = searchParams.get('topic'); // Nhận tham số topic từ nút bấm

  // Kiểm tra Secret Key
  if (key !== process.env.NEXT_PUBLIC_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Lọc nguồn tin: Nếu có topic thì chỉ cào topic đó, không thì cào tất cả
  const selectedSources = topic
    ? SOURCES_CONFIG.filter(s => s.slug === topic)
    : SOURCES_CONFIG;

  let totalProcessed = 0;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    for (const source of selectedSources) {
      // Đảm bảo Category tồn tại
      const category = await prisma.category.upsert({
        where: { slug: source.slug },
        update: {},
        create: { name: source.name, slug: source.slug },
      });

      // Đọc RSS
      let feed;
      try {
        feed = await parser.parseURL(source.url);
      } catch (e) {
        console.error(`RSS Error [${source.name}]:`, e);
        continue;
      }

      // LỌC TIN TRONG NGÀY & Giới hạn 3 bài để tránh timeout
      const items = feed.items.filter(item => {
        const pubDate = new Date(item.pubDate || "");
        return pubDate >= startOfToday;
      }).slice(0, 5);

      for (const item of items) {
        const sourceUrl = item.link || "";
        // Tạo slug từ URL hoặc timestamp
        const slug = sourceUrl.split('/').pop()?.replace('.html', '').substring(0, 100) || `news-${Date.now()}`;

        // Kiểm tra bài viết đã tồn tại chưa
        const isExisted = await prisma.post.findUnique({ where: { slug } });
        if (isExisted) continue;

        let rawHTML = "";
        let coverImage = "";

        try {
          const res = await fetch(sourceUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 0 }
          });

          if (!res.ok) continue;

          const html = await res.text();
          const $ = cheerio.load(html);

          // Lấy ảnh cover từ OpenGraph
          coverImage = $('meta[property="og:image"]').attr('content') || "";

          const detail = $(getSelector(sourceUrl));

          // BƯỚC MỚI: Chuyển đổi các thẻ meta chứa ảnh của VnExpress sang img thực tế
          detail.find('meta[itemprop="url"], meta[property="og:image"]').each((_, el) => {
            const $el = $(el);
            const url = $el.attr('content');

            // Kiểm tra nếu content chứa link ảnh
            if (url && url.startsWith('http')) {
              // Chèn một thẻ img vào ngay trước hoặc thay thế thẻ meta đó
              $el.replaceWith(`<img src="${url}" class="w-full rounded-2xl my-4 shadow-md" />`);
            }
          });

          // Sau đó mới thực hiện quét toàn bộ danh sách img để lấy ảnh (bao gồm cả ảnh vừa convert)
          const images: { src: string; alt: string }[] = [];
          detail.find('img').each((_, el) => {
            const $img = $(el);
            const src = $img.attr('src') || $img.attr('data-src');
            if (src && src.startsWith('http')) {
              images.push({ src, alt: $img.attr('alt') || "Hình ảnh minh họa" });
            }
          });

          // Tiếp tục các bước dọn dẹp rác khác...
          detail.find('script, style, iframe, .ads').remove();
          rawHTML = detail.html() || "";
        } catch (err) {
          console.error(`Fetch Content Error: ${sourceUrl}`, err);
          continue;
        }

        if (!rawHTML) continue;

        // Gọi AI xử lý nội dung
        const aiResult = await rewriteWithAI(item.title || "", rawHTML);

        // Lưu vào Database
        await prisma.post.create({
          data: {
            title: aiResult?.title || item.title || "No Title",
            slug: slug,
            content: aiResult?.content || rawHTML,
            excerpt: aiResult?.excerpt || item.contentSnippet?.substring(0, 160) || "",
            coverImage: coverImage,
            sourceUrl: sourceUrl,
            isAuto: true,
            published: true,
            categoryId: category.id,
            metaTitle: aiResult?.title || item.title || "",
          },
        });
        totalProcessed++;
      }
    }

    return NextResponse.json({
      status: "Success",
      message: `Đã xử lý ${totalProcessed} bài mới thuộc mục: ${topic || 'Tất cả'}.`
    });

  } catch (error: any) {
    return NextResponse.json({
      status: "Error",
      message: error.message
    }, { status: 500 });
  }
}