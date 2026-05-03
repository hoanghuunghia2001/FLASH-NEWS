'use server'

export async function runManualCrawl() {
  const secret = process.env.CRON_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/cron/crawl?key=${secret}`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Crawl failed');
    
    return await res.json();
  } catch (error) {
    return { status: "Error", message: "Không thể kết nối API cào tin" };
  }
}