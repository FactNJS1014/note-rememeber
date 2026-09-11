import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Trash2, RotateCcw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { restoreNoteAction, permanentDeleteNoteAction } from '@/actions/notes';

export default async function TrashPage() {
  const user = await requireAuth();

  const deletedNotes = await prisma.note.findMany({
    where: { userId: user.userId, isDeleted: true },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-rose-400" />
          <span>Trash</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Notes in trash can be restored or permanently deleted</p>
      </div>

      {deletedNotes.length === 0 ? (
        <div className="p-16 bg-slate-900 border border-slate-800 rounded-3xl text-center">
          <p className="text-slate-400 text-sm">Trash is empty.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deletedNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div>
                <h2 className="font-bold text-slate-200 text-sm">{note.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Deleted on {formatDate(note.updatedAt)}</p>
              </div>

              <div className="flex items-center gap-2">
                <form action={restoreNoteAction.bind(null, note.id)}>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs flex items-center gap-1.5 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                </form>

                <form action={permanentDeleteNoteAction.bind(null, note.id)}>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs flex items-center gap-1.5 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
