import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { ArrowLeft, Edit3, Trash2, Pin, Heart, Archive, Clock, Tag, Folder } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { softDeleteNoteAction, toggleFavoriteAction, togglePinAction } from '@/actions/notes';

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAuth();

  const note = await prisma.note.findFirst({
    where: {
      id: params.id,
      userId: user.userId, // USER ISOLATION AUTHORIZATION CHECK
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
      reminders: true,
    },
  });

  if (!note) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <Link
          href="/notes"
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notes</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/notes/${note.id}/edit`}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </Link>

          <form action={softDeleteNoteAction.bind(null, note.id)}>
            <button
              type="submit"
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Note Main Content */}
      <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{note.title}</h1>
          <div className="flex items-center gap-2">
            {note.isPinned && <Pin className="w-5 h-5 text-amber-400 fill-amber-400" />}
            {note.isFavorite && <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />}
          </div>
        </div>

        {/* Category & Tags metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-b border-slate-800/80 pb-4">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-400 rounded-lg font-medium">
            <Folder className="w-3.5 h-3.5" />
            <span>{note.category?.name || 'Uncategorized'}</span>
          </span>

          {note.tags.map((t) => (
            <span
              key={t.tagId}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg font-mono text-[11px]"
            >
              <Tag className="w-3 h-3" />
              <span>{t.tag.name}</span>
            </span>
          ))}

          <span className="text-slate-500 ml-auto">Last updated: {formatDate(note.updatedAt)}</span>
        </div>

        {/* Note Body */}
        <div className="text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap text-sm md:text-base font-light">
          {note.content}
        </div>

        {/* Reminders section */}
        {note.reminders.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Scheduled Reminder</span>
            </h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300">
              <p className="font-semibold">{note.reminders[0].title}</p>
              <p className="text-slate-500 mt-1">{formatDate(note.reminders[0].remindAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
