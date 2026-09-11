// src/actions/categories.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(name: string) {
  const user = await requireAuth();

  if (!name || !name.trim()) {
    throw new Error("Category name is required");
  }

  // ป้องกันการสร้างชื่อซ้ำใน User เดียวกัน
  let category = await prisma.category.findFirst({
    where: { userId: user.userId, name: name.trim() },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        userId: user.userId,
        name: name.trim(),
        color: "#6366f1",
      },
    });
  }

  revalidatePath("/notes/new");
  revalidatePath("/categories");
  return { success: true, category };
}
