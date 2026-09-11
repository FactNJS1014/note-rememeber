import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { FileText, Pin, Heart, Archive, Bell, Plus, ArrowRight, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await requireAuth();

  // Fetch Dashboard Statistics
  const [
    totalNotes,
    pinnedCount,
    favoritesCount,
    archivedCount,
    upcomingReminders,
    recentNotes,
    activityLogs
  ] = await Promise.all([
    prisma.note.count({ where: { userId: user.userId, isDeleted: false, isArchived: false } }),
    prisma.note.count({ where: { userId: user.userId, isPinned: true, isDeleted: false } }),
    prisma.note.count({ where: { userId: user.userId, isFavorite: true, isDeleted: false } }),
    prisma.note.count({ where: { userId: user.userId, isArchived: true, isDeleted: false } }),
    prisma.reminder.findMany({
      where: { userId: user.userId, completed: false },
      orderBy: { remindAt: 'asc' },
      take: 5,
      include: { note: true },
    }),
    prisma.note.findMany({
      where: { userId: user.userId, isDeleted: false, isArchived: false },
      orderBy: { updatedAt: 'desc' },
      take: 6,
      include: { category: true, tags: { include: { tag: true } } },
    }),
    prisma.activityLog.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Good Morning, {user.name} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            What do you want to remember and organize today?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/notes/new"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </Link>
          <Link
            href="/reminders"
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-2xl border border-slate-700 flex items-center gap-2 transition-all text-sm"
          >
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>Set Reminder</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Notes</p>
            <p className="text-2xl font-bold text-white mt-1">{totalNotes}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pinned</p>
            <p className="text-2xl font-bold text-white mt-1">{pinnedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Pin className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Favorites</p>
            <p className="text-2xl font-bold text-white mt-1">{favoritesCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Archived</p>
            <p className="text-2xl font-bold text-white mt-1">{archivedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
            <Archive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Notes & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Notes (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Recent Notes</span>
            </h2>
            <Link href="/notes" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentNotes.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-slate-400 text-sm">No notes yet. Start by creating your first note.</p>
              <Link
                href="/notes/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                + Create Note
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1 text-sm">
                        {note.title}
                      </h3>
                      {note.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {note.excerpt || note.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {note.category?.name || 'Uncategorized'}
                    </span>
                    <span>Updated {formatDate(note.updatedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Widgets: Reminders & Activity */}
        <div className="space-y-6">
          {/* Upcoming Reminders */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span>Upcoming Reminders</span>
              </h2>
              <Link href="/reminders" className="text-xs text-indigo-400 hover:underline">
                View
              </Link>
            </div>

            {upcomingReminders.length === 0 ? (
              <p className="text-xs text-slate-500">No active reminders scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3"
                  >
                    <Clock className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-200 leading-snug">{rem.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatDate(rem.remindAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white">Recent Activity</h2>
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No recent activity recorded.</p>
            ) : (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="text-xs text-slate-400 border-l-2 border-indigo-500/40 pl-3 py-0.5">
                    <p className="text-slate-300">{log.details}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(log.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
