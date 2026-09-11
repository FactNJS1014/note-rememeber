import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NoteEditor } from '@/components/notes/NoteEditor';

export default async function NewNotePage() {
  const user = await requireAuth();

  const categories = await prisma.category.findMany({
    where: { userId: user.userId },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Create New Note</h1>
        <p className="text-slate-400 text-sm mt-0.5">Write down your thoughts, tasks, or code snippets</p>
      </div>

      <NoteEditor categories={categories} />
    </div>
  );
}
