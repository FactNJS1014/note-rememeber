'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { reminderSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

export async function createReminderAction(data: any) {
  const user = await requireAuth();
  const validated = reminderSchema.parse(data);

  const reminder = await prisma.reminder.create({
    data: {
      userId: user.userId,
      title: validated.title,
      remindAt: new Date(validated.remindAt),
      noteId: validated.noteId || null,
    },
  });

  revalidatePath('/reminders');
  revalidatePath('/dashboard');
  return { success: true, reminder };
}

export async function toggleReminderCompleteAction(reminderId: string) {
  const user = await requireAuth();
  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, userId: user.userId },
  });
  if (!reminder) throw new Error('Reminder not found');

  await prisma.reminder.update({
    where: { id: reminderId },
    data: { completed: !reminder.completed },
  });

  revalidatePath('/reminders');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteReminderAction(reminderId: string) {
  const user = await requireAuth();
  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, userId: user.userId },
  });
  if (!reminder) throw new Error('Reminder not found');

  await prisma.reminder.delete({ where: { id: reminderId } });

  revalidatePath('/reminders');
  revalidatePath('/dashboard');
  return { success: true };
}
