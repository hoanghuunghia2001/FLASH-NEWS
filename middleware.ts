import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  console.log("Middleware đang chạy tại:", pathname);
  console.log("Đã login chưa:", isLoggedIn);

  // Nếu chưa login mà truy cập /admin → redirect về /login
  if (!isLoggedIn && pathname.startsWith("/admin")) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Nếu đã login mà vào /login → đá về /admin (optional)
  if (isLoggedIn && pathname === "/login") {
    return Response.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};