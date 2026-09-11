"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validation";

export async function registerAction(prevState: any, formData: FormData) {
  let shouldRedirect = false;

  try {
    const data = Object.fromEntries(formData.entries());
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    const { name, email, password } = validated.data;

    // ตรวจสอบอีเมลซ้ำ
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email is already registered. Please sign in." };
    }

    // Hash พาสเวิร์ด
    const passwordHash = await hashPassword(password);

    // บันทึก User ลง Neon PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // สร้าง JWT Token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // ฝัง Cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    shouldRedirect = true;
  } catch (error: any) {
    console.error("Register Server Action Error:", error);
    return { error: error.message || "Failed to register. Please try again." };
  }

  // เรียก redirect นอกบล็อก try-catch เพื่อป้องกัน NEXT_REDIRECT exception
  if (shouldRedirect) {
    redirect("/dashboard");
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  let shouldRedirect = false;

  try {
    const data = Object.fromEntries(formData.entries());
    const validated = loginSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    const { email, password } = validated.data;

    // ค้นหา User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    // ตรวจสอบ Password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    // ออก JWT Token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    shouldRedirect = true;
  } catch (error: any) {
    console.error("Login Server Action Error:", error);
    return { error: error.message || "Authentication failed" };
  }

  if (shouldRedirect) {
    redirect("/dashboard");
  }
}
