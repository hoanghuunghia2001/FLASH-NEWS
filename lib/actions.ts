"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined, // Đối số thứ nhất cho useActionState
  formData: FormData             // Đối số thứ hai
) {
  try {
    // Chuyển formData thành object để signIn
    const data = Object.fromEntries(formData);
    await signIn("credentials", {
      ...data,
      redirectTo: "/admin", // Đăng nhập xong đẩy vào admin
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Email hoặc mật khẩu không chính xác.";
        default:
          return "Lỗi hệ thống FlashNews.";
      }
    }
    throw error;
  }
}