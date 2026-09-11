import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Archive } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function ArchivedPage() {
  const user = await requireAuth();

  const notes = await prisma.note.findMany({
    where: { userId: user.userId, isArchived: true, isDeleted: false },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Archive className="w-6 h-6 text-slate-400" />
          <span>Archived Notes</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Stored inactive notes for future reference</p>
      </div>

      {notes.length === 0 ? (
        <div className="p-16 bg-slate-900 border border-slate-800 rounded-3xl text-center">
          <p className="text-slate-400 text-sm">No archived notes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 transition-all"
            >
              <h2 className="font-bold text-slate-300 line-clamp-1 mb-2">{note.title}</h2>
              <p className="text-slate-500 text-xs line-clamp-3 mb-4">{note.excerpt || note.content}</p>
              <div className="text-[11px] text-slate-600 border-t border-slate-800/80 pt-3">
                Archived {formatDate(note.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
