"use client";

import { useActionState } from "react"; // Dùng useActionState cho Next.js 15
import Link from "next/link";
import { authenticate } from "@/lib/actions";

export default function AdminLoginPage() {
  // state sẽ chứa thông báo lỗi trả về từ action
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf6] dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800">
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
            FlashNews Admin
          </h2>
        </div>

        {/* Sử dụng action thay vì onSubmit */}
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-red-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-red-600 transition-all"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-3 rounded-xl hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all disabled:opacity-50"
          >
            {isPending ? "Đang xác thực..." : "Đăng nhập Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}