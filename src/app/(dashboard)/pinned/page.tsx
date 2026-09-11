import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Pin, FileText, Heart } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function PinnedNotesPage() {
  const user = await requireAuth();

  const notes = await prisma.note.findMany({
    where: { userId: user.userId, isPinned: true, isDeleted: false },
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Pin className="w-6 h-6 text-amber-400" />
          <span>Pinned Notes</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Quick access to your most essential notes</p>
      </div>

      {notes.length === 0 ? (
        <div className="p-16 bg-slate-900 border border-slate-800 rounded-3xl text-center">
          <p className="text-slate-400 text-sm">No pinned notes yet. Pin your important notes to keep them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-slate-200 line-clamp-1">{note.title}</h2>
                <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-slate-400 text-xs line-clamp-3 mb-4">{note.excerpt || note.content}</p>
              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
                Updated {formatDate(note.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
