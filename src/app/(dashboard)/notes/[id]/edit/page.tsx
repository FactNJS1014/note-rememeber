import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NoteEditor } from '@/components/notes/NoteEditor';

export default async function EditNotePage({ params }: { params: { id: string } }) {
  const user = await requireAuth();

  const [note, categories] = await Promise.all([
    prisma.note.findFirst({
      where: { id: params.id, userId: user.userId },
      include: {
        category: true,
        tags: { include: { tag: true } },
        reminders: true,
      },
    }),
    prisma.category.findMany({ where: { userId: user.userId } }),
  ]);

  if (!note) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Edit Note</h1>
        <p className="text-slate-400 text-sm mt-0.5">Update content, categories, or scheduled reminders</p>
      </div>

      <NoteEditor initialNote={note} categories={categories} />
    </div>
  );
}
