import { auth } from "@/auth";

// Next.js 16 yêu cầu export default là một function
export default auth((req) => {
  // Hàm này chạy mỗi khi user truy cập vào các route trong matcher
  // Logic kiểm tra đã nằm trong callback 'authorized' của file auth.ts
});

export const config = {
  // Bảo vệ tất cả các trang bắt đầu bằng /admin
  matcher: ["/admin/:path*"],
};