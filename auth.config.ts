import type { NextAuthConfig } from "next-auth";

// auth.config.ts
export const authConfig = {
  pages: {
    signIn: "/login", 
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/login";
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      // BƯỚC QUAN TRỌNG: Nếu là trang login, cho phép truy cập ngay lập tức
      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      // Bảo vệ các trang admin
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect về /login
      }

      return true; // Các trang khác (trang chủ, tin tức) cho xem thoải mái
    },
  },
  providers: [],
} satisfies NextAuthConfig;