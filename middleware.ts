// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // DÒNG NÀY ĐỂ DEBUG:
  console.log("Middleware đang chạy tại:", req.nextUrl.pathname);
});

export const config = {
  // Thu hẹp matcher lại để test, chỉ chạy cho admin và login
  matcher: ["/admin/:path*", "/login"],
};