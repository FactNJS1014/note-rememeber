"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { noteSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function createNoteAction(data: any) {
  const user = await requireAuth();
  const validated = noteSchema.parse(data);

  const excerpt =
    validated.content.slice(0, 150) +
    (validated.content.length > 150 ? "..." : "");

  const note = await prisma.note.create({
    data: {
      userId: user.userId,
      title: validated.title,
      content: validated.content,
      excerpt,
      color: validated.color,
      type: validated.type,
      isPinned: validated.isPinned,
      isFavorite: validated.isFavorite,
      isArchived: validated.isArchived,
      categoryId: validated.categoryId || null,
    },
  });

  if (validated.tags && validated.tags.length > 0) {
    for (const tagName of validated.tags) {
      let tag = await prisma.tag.findFirst({
        where: { userId: user.userId, name: tagName.toLowerCase() },
      });
      if (!tag) {
        tag = await prisma.tag.create({
          data: { userId: user.userId, name: tagName.toLowerCase() },
        });
      }
      await prisma.noteTag.create({
        data: { noteId: note.id, tagId: tag.id },
      });
    }
  }

  // if (validated.remindAt) {
  //   await prisma.reminder.create({
  //     data: {
  //       userId: user.userId,
  //       noteId: note.id,
  //       title: `Reminder for: ${note.title}`,
  //       remindAt: new Date(validated.remindAt),
  //     },
  //   });
  // }

  await prisma.activityLog.create({
    data: {
      userId: user.userId,
      action: "CREATED",
      details: `Created note "${note.title}"`,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/notes");
  return { success: true, noteId: note.id };
}

export async function updateNoteAction(noteId: string, data: any) {
  const user = await requireAuth();
  const validated = noteSchema.parse(data);

  // Authorization check
  const existingNote = await prisma.note.findFirst({
    where: { id: noteId, userId: user.userId },
  });

  if (!existingNote) {
    throw new Error("Note not found or access denied");
  }

  const excerpt =
    validated.content.slice(0, 150) +
    (validated.content.length > 150 ? "..." : "");

  await prisma.note.update({
    where: { id: noteId },
    data: {
      title: validated.title,
      content: validated.content,
      excerpt,
      color: validated.color,
      type: validated.type,
      isPinned: validated.isPinned,
      isFavorite: validated.isFavorite,
      isArchived: validated.isArchived,
      categoryId: validated.categoryId || null,
    },
  });

  // Re-sync tags
  await prisma.noteTag.deleteMany({ where: { noteId } });
  if (validated.tags && validated.tags.length > 0) {
    for (const tagName of validated.tags) {
      let tag = await prisma.tag.findFirst({
        where: { userId: user.userId, name: tagName.toLowerCase() },
      });
      if (!tag) {
        tag = await prisma.tag.create({
          data: { userId: user.userId, name: tagName.toLowerCase() },
        });
      }
      await prisma.noteTag.create({
        data: { noteId, tagId: tag.id },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      userId: user.userId,
      action: "UPDATED",
      details: `Updated note "${validated.title}"`,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}`);
  return { success: true };
}

export async function togglePinAction(noteId: string) {
  const user = await requireAuth();
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: user.userId },
  });
  if (!note) throw new Error("Note not found");

  await prisma.note.update({
    where: { id: noteId },
    data: { isPinned: !note.isPinned },
  });

  revalidatePath("/dashboard");
  revalidatePath("/notes");
  revalidatePath("/pinned");
  return { success: true };
}

export async function toggleFavoriteAction(noteId: string) {
  const user = await requireAuth();
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: user.userId },
  });
  if (!note) throw new Error("Note not found");

  await prisma.note.update({
    where: { id: noteId },
    data: { isFavorite: !note.isFavorite },
  });

  revalidatePath("/dashboard");
  revalidatePath("/notes");
  revalidatePath("/favorites");
  return { success: true };
}

export async function softDeleteNoteAction(noteId: string) {
  const user = await requireAuth();
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: user.userId },
  });
  if (!note) throw new Error("Note not found");

  await prisma.note.update({
    where: { id: noteId },
    data: { isDeleted: true },
  });

  revalidatePath("/dashboard");
  revalidatePath("/notes");
  revalidatePath("/trash");
  // ตัด return { success: true }; ออกเพื่อแก้ Type mismatch
}

export async function restoreNoteAction(noteId: string) {
  const user = await requireAuth();
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: user.userId },
  });
  if (!note) throw new Error("Note not found");

  await prisma.note.update({
    where: { id: noteId },
    data: { isDeleted: false },
  });

  revalidatePath("/trash");
  revalidatePath("/notes");
}

export async function permanentDeleteNoteAction(noteId: string) {
  const user = await requireAuth();
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: user.userId },
  });
  if (!note) throw new Error("Note not found");

  await prisma.note.delete({ where: { id: noteId } });

  revalidatePath("/trash");
}
